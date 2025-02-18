'use strict'
import { NightwatchBrowser } from 'nightwatch'
import init from '../helpers/init'

module.exports = {
    before: function (browser: NightwatchBrowser, done: VoidFunction) {
        init(browser, done, 'http://127.0.0.1:8080?plugins=solidity,udapp', false, {
            name: 'scriptRunner',
            url: 'http://127.0.0.1:3000?template=starknet6.11',
        })
    },
    test: function (browser: NightwatchBrowser) {
        browser
            .addFile('test.ts', { content: testFile })
            .executeScriptInTerminal('remix.execute("test.ts")')

            .waitForElementContainsText('*[data-id="terminalJournal"]', 'Passed: 1', 60000)
            .waitForElementContainsText('*[data-id="terminalJournal"]', 'Chain ID:', 60000)
            .waitForElementContainsText('*[data-id="terminalJournal"]', 'New OZ account:', 60000)
            .waitForElementContainsText('*[data-id="terminalJournal"]', 'privateKey=', 60000)
            .waitForElementContainsText('*[data-id="terminalJournal"]', 'publicKey=', 60000)
            .waitForElementContainsText('*[data-id="terminalJournal"]', 'Precalculated account address=', 60000)

    }
}

const testFile = `import { expect } from 'chai'
import {
    Account,
    constants,
    ec,
    json,
    stark,
    RpcProvider,
    hash,
    CallData,
} from 'starknet'

describe('Starknet Library Test', function () {
    it('should fetch the latest block number', async function () {
        // Use dRPC Sepolia RPC endpoint
        const myProvider = new RpcProvider({
            nodeUrl: 'https://starknet-sepolia.drpc.org',
        })

        const chainId = await myProvider.getChainId()
        console.log('Chain ID:', chainId)
        // new Open Zeppelin account v0.8.1
        // Generate public and private key pair.
        const privateKey = stark.randomAddress()
        console.log('New OZ account:')
        console.log('privateKey=', privateKey)
        const starkKeyPub = ec.starkCurve.getStarkKey(privateKey)
        console.log('publicKey=', starkKeyPub)

        const OZaccountClassHash =
            '0x061dac032f228abef9c6626f995015233097ae253a7f72d68552db02f2971b8f'
        // Calculate future address of the account
        const OZaccountConstructorCallData = CallData.compile({
            publicKey: starkKeyPub,
        })
        const OZcontractAddress = hash.calculateContractAddressFromHash(
            starkKeyPub,
            OZaccountClassHash,
            OZaccountConstructorCallData,
            0,
        )
        console.log('Precalculated account address=', OZcontractAddress)
    })
})
`