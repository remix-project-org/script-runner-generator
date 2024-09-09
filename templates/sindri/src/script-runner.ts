const createCircuit = sindri.default.createCircuit
const proveCircuit = sindri.default.proveCircuit

sindri.default.createCircuit = function (files: any, tags: any) {
  _paq.push(['trackEvent', 'script-runner', 'sindri.SindriClient.createCircuit'])
  return createCircuit.call(this, files, tags)
}
sindri.default.proveCircuit = function (circuitId: any, proofInput: any) {
  _paq.push(['trackEvent', 'script-runner', 'sindri.SindriClient.proveCircuit'])
  return proveCircuit.call(this, circuitId, proofInput)
}
import './lib/header'
import './lib/matomo'
import './lib/codeExecutor'
import './lib/web3provider'
import './lib/console'
