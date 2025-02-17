'use strict'
import { NightwatchBrowser } from 'nightwatch'
import init from '../helpers/init'

module.exports = {
    before: function (browser: NightwatchBrowser, done: VoidFunction) {
        init(browser, done, 'http://127.0.0.1:8080?plugins=solidity,udapp', false, {
            name: 'scriptRunner',
            url: 'http://127.0.0.1:3000?template=noir',
        })
    },
    test: function (browser: NightwatchBrowser) {
        browser
            .addFile('test.ts', { content: testFile })
            .executeScriptInTerminal('remix.execute("test.ts")')
            .waitForElementContainsText('*[data-id="terminalJournal"]', 'Passed: 1', 60000)
    }
}

const testFile = `const { expect } = require('chai')
import { compile, createFileManager } from '@noir-lang/noir_wasm'
import { Noir } from '@noir-lang/noir_js'
import { UltraPlonkBackend } from '@aztec/bb.js'

const mainNrContent = \`
fn main(age: u8) {
  assert(age >= 18);
}
\`

const nargoTomlContent = \`
[package]
name = "age_verification"
version = "0.1.0"
type="bin"
authors = ["Your Name <you@example.com>"]
edition = "2018"

[dependencies]
\`

async function getCircuit() {
    const fm = createFileManager('/')

    const tomlBytes = new TextEncoder().encode(nargoTomlContent)
    const mainBytes = new TextEncoder().encode(mainNrContent)
    await fm.writeFile('./src/main.nr', new Blob([mainBytes]).stream())
    await fm.writeFile('Nargo.toml', new Blob([tomlBytes]).stream())

    const result = await compile(fm)
    if (!('program' in result)) {
        throw new Error('Compilation failed')
    }

    return result.program
}

describe('Noir Program Test', () => {
    it('should compile, execute, prove, and verify', async () => {
        const noir_program = await getCircuit()

        //expect(noir_program, 'Compile output ').to.be.an('object')

        const inputs = { age: 20 } // Example input

        // JS Proving
        const program = new Noir(noir_program)
        const { witness } = await program.execute(inputs)

        const backend = new UltraPlonkBackend(noir_program.bytecode)
        const proof = await backend.generateProof(witness)

        // JS verification
        const verified = await backend.verifyProof(proof)
        expect(verified, 'Proof fails verification in JS').to.be.true
    })
})
`
