'use strict'
import { NightwatchBrowser } from 'nightwatch'
import init from '../helpers/init'

module.exports = {
    before: function (browser: NightwatchBrowser, done: VoidFunction) {
        init(browser, done, 'http://127.0.0.1:8080?plugins=solidity,udapp', false, {
            name: 'scriptRunner',
            url: 'http://127.0.0.1:3000?template=circles-sdk',
        })
    },
    test: function (browser: NightwatchBrowser) {
        browser
            .addFile('test.ts', { content: testFile })
            .executeScriptInTerminal('remix.execute("test.ts")')
            .waitForElementContainsText('*[data-id="terminalJournal"]', '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4', 60000)
    }
}

const testFile = `

import { ChainConfig, Sdk } from '@circles-sdk/sdk';
import { ethers } from "ethers";

;(async () => {
    // Chiado testnet:
    const chainConfig: ChainConfig = {
        pathfinderUrl: 'https://pathfinder.aboutcircles.com',
        circlesRpcUrl: 'https://chiado-rpc.aboutcircles.com',
        v1HubAddress: '0xdbf22d4e8962db3b2f1d9ff55be728a887e47710',
        v2HubAddress: '0x2066CDA98F98397185483aaB26A89445addD6740',
        migrationAddress: '0x2A545B54bb456A0189EbC53ed7090BfFc4a6Af94'
    };

    
    const signer = await (new ethers.BrowserProvider(web3Provider)).getSigner(0)

    const sdk = new Sdk(chainConfig, signer);
    console.log(sdk)
})()

`
