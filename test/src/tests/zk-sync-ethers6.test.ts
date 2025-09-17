'use strict'
import { NightwatchBrowser } from 'nightwatch'
import init from '../helpers/init'

module.exports = {
    before: function (browser: NightwatchBrowser, done: VoidFunction) {
        init(browser, done, 'http://127.0.0.1:8080?plugins=solidity,udapp', false, {
            name: 'scriptRunner',
            url: 'http://127.0.0.1:3000?template=zksyncv6',
        })
    },
    'compile storage.sol': function (browser: NightwatchBrowser) {
        browser
            .waitForElementVisible('*[data-id="treeViewLitreeViewItemcontracts"]')
            .click('*[data-id="treeViewLitreeViewItemcontracts"]')
            .waitForElementVisible('*[data-id="treeViewLitreeViewItemcontracts/1_Storage.sol"]')
            .click('*[data-id="treeViewLitreeViewItemcontracts/1_Storage.sol"]')
            .pause(2000)
            .click('*[data-id="compile-action"]') // run the script
            .pause(1000)
            .clickLaunchIcon('udapp')
            .waitForElementVisible('*[data-id="Deploy - transact (not payable)"]')
            .click('*[data-id="Deploy - transact (not payable)"]')
            .pause(1000)
    },
    'Should exec a zk-sync TS file': function (browser: NightwatchBrowser) {
        browser
            .addFile('zkSync.ts', { content: zkSync })
            .executeScriptInTerminal('remix.execute("zkSync.ts")')
            .waitForElementPresent({
                locateStrategy: 'xpath',
                selector: "//span[@class='text-log' and contains(text(), 'test2:true')]",
                timeout: 240000
            })

    },
}


const zkSync = `
import { ethers } from "ethers";
import { Provider, types } from "zksync-ethers";

(async () => {
  try {

    const provider = Provider.getDefaultProvider(types.Network.Sepolia); // ZKsync Era testnet (L2)

    const blockNumber = await provider.getBlockNumber();
    
    console.log(\`test2:\${blockNumber > 1}\`)

  } catch (e) {
    console.error('Error in script!')
    console.error(e.message)
    console.error(e)
  }
})()
  
`