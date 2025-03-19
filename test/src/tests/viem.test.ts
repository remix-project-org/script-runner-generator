'use strict'
import { NightwatchBrowser } from 'nightwatch'
import init from '../helpers/init'

module.exports = {}


//     before: function (browser: NightwatchBrowser, done: VoidFunction) {
//         init(browser, done, 'http://127.0.0.1:8080?plugins=solidity,udapp', false, {
//             name: 'scriptRunner',
//             url: 'http://127.0.0.1:3000?template=chainlink',
//         })
//     },
//     test: function (browser: NightwatchBrowser) {
//         browser
//             .addFile('test.ts', { content: testFile })
//             .executeScriptInTerminal('remix.execute("test.ts")')
//             .waitForElementContainsText('*[data-id="terminalJournal"]', 'Viem Test Passed: Latest block number is', 60000)
//     }
// }

const testFile = `

import { createPublicClient, http } from 'viem'
import { hardhat } from 'viem/chains' // Use hardhat for local Ganache too

async function testViem() {
    try {
        const client = createPublicClient({
            chain: hardhat,
            transport: http('http://127.0.0.1:8545'),
        })

        const blockNumber = await client.getBlockNumber()
        console.log('Viem Test Passed: Latest block number is', blockNumber)
    } catch (error) {
        console.error('Viem Test Failed:', error)
    }
}

testViem()
`
