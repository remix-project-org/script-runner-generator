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
            .addFile('.env', { content: dotEnvFile })
            .executeScriptInTerminal('remix.execute("test.ts")')
            .waitForElementContainsText('*[data-id="terminalJournal"]', '{"gist_token":"mytoken","testing":"true"} ', 60000)
    }
}

const testFile = `

const dotenv = require('dotenv')


;(async () => {
    try {
        const buf = await remix.call('fileManager', 'readFile', '.env')
        console.log(buf)
        console.log('ok')
        const config = dotenv.parse(buf) // will return an object
        console.log(config)
    } catch (error) {
        console.error('Error:', error)
    }
})()


`

const dotEnvFile = `
gist_token=mytoken
testing=true
`
