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
            .waitForElementContainsText('*[data-id="terminalJournal"]', '0xa464617267738066736f757263657901290a2020202020202f2f20596f7572204a61766153637269707420636f646520746f206265206578656375746564206279207468652073696d756c61746f720a202020202020636f6e7374206665746368203d207265717569726528276e6f64652d666574636827293b0a2020202020206d6f64756c652e6578706f727473203d206173796e63202829203d3e207b0a2020202020202020636f6e737420726573706f6e7365203d206177616974206665746368282768747470733a2f2f6170692e6578616d706c652e636f6d2f6461746127293b0a2020202020202020636f6e73742064617461203d20617761697420726573706f6e73652e6a736f6e28293b0a202020202020202072657475726e20646174612e76616c75653b0a2020202020207d3b0a202020206c636f64654c616e6775616765006c636f64654c6f636174696f6e00', 60000)
    }
}

const testFile = `
import { buildRequestCBOR } from '@chainlink/functions-toolkit';

;(async () => {
    try {
        // Define your request configuration
        // Define your request configuration
        const requestConfig = {
            codeLocation: 0, // Inline code
            codeLanguage: 0, // JavaScript
            source: \`
      // Your JavaScript code to be executed by the simulator
      const fetch = require('node-fetch');
      module.exports = async () => {
        const response = await fetch('https://api.example.com/data');
        const data = await response.json();
        return data.value;
      };
    \`,
            secrets: {}, // Any secrets your code requires
            args: [], // Arguments to pass to your code
        }

        const cbor = buildRequestCBOR(requestConfig)

        console.log(cbor)
    } catch (error) {
        console.error('Error:', error)
    }
})()

`
