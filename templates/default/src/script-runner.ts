declare global {
  interface Window {
    [key: string]: any;
    reuire: any;
  }
}
// Imports will be generated here
import * as web3Js from 'web3'
import Web3 from 'web3'

// Custom code starts here
//{{CUSTOM_CODE}}
// Custom code ends here

// Additional logic starts here
//{{ADDITIONAL_LOGIC}}
// Additional logic ends here

const scriptReturns = {} // keep track of modules exported values
const fileContents = {} // keep track of file content
window.require = (module: string) => {
  if (module === 'web3') return web3Js
  if (window[module]) return window[module] // library
  if (window['_' + module]) return window['_' + module] // library
  else if ((module.endsWith('.json') || module.endsWith('.abi')) && window.__execPath__ && fileContents[window.__execPath__]) return JSON.parse(fileContents[window.__execPath__][module])
  else if (window.__execPath__ && scriptReturns[window.__execPath__]) return scriptReturns[window.__execPath__][module] // module exported values
  else throw new Error(`${module} module require is not supported by Remix IDE`)
}

