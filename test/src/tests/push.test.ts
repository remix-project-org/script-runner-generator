'use strict'
import { NightwatchBrowser } from 'nightwatch'
import init from '../helpers/init'

module.exports = {
    before: function (browser: NightwatchBrowser, done: VoidFunction) {
        init(browser, done, 'http://127.0.0.1:8080?plugins=solidity,udapp', false, {
            name: 'scriptRunner',
            url: 'http://127.0.0.1:3000?template=push',
        })
    },
    test: function (browser: NightwatchBrowser) {
        browser
            .addFile('test.ts', { content: testFile })
            .executeScriptInTerminal('remix.execute("test.ts")')
            .waitForElementContainsText('*[data-id="terminalJournal"]', '420000000000', 60000)
    }
}

const testFile = `import { PushChain } from '@pushchain/core'

async function testPushCore() {
    console.log(PushChain.utils.helpers.parseUnits('420', 9))
}

// Run the test
testPushCore()
`
