'use strict'
import { NightwatchBrowser } from 'nightwatch'
import init from '../helpers/init'

module.exports = {
    before: function (browser: NightwatchBrowser, done: VoidFunction) {
        init(browser, done, 'http://127.0.0.1:8080?plugins=solidity,udapp', false, {
            name: 'scriptRunner',
            url: 'http://127.0.0.1:3000?template=chainlink',
        })
    },
    test: function (browser: NightwatchBrowser) {
        browser
            .addFile('test.ts', { content: testFile })
            .executeScriptInTerminal('remix.execute("test.ts")')
            .pause()
            .waitForElementContainsText('*[data-id="terminalJournal"]', 'Passed: 1', 60000)
    }
}

const testFile = `
const { decodeResult } = require('@chainlink/functions-toolkit');

try {
    console.log("Successfully loaded @chainlink/functions-toolkit");

    // Example: Decode a mock result
    const encodedResult = "0x000000000000000000000000000000000000000000000000000000000000000a"; // Example hex result
    const decoded = decodeResult(encodedResult, ['uint256']); // Expecting a uint256

    console.log("Decoded result:", decoded);
} catch (error) {
    console.error("Error:", error);
}
`
