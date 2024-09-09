const snarkJs = Object.assign({}, snarkjs, {
    zKey: {
        ...snarkjs.zKey,
        newZKey: function (r1cs: any, ptau: any, zkey: any) {
            _paq.push(['trackEvent', 'script-runner', 'snarkjs.zKey.newZKey'])
            return snarkjs.zKey.newZKey(r1cs, ptau, zkey)
        },
        exportVerificationKey: function (zkey: any) {
            _paq.push(['trackEvent', 'script-runner', 'snarkjs.zKey.exportVerificationKey'])
            return snarkjs.zKey.exportVerificationKey(zkey)
        },
        exportSolidityVerifier: function (zkey: any, template: any) {
            _paq.push(['trackEvent', 'script-runner', 'snarkjs.zKey.exportSolidityVerifier'])
            return snarkjs.zKey.exportSolidityVerifier(zkey, template)
        },
        setup: function (r1cs: any, ptau: any, zkey: any) {
            _paq.push(['trackEvent', 'script-runner', 'snarkjs.plonk.setup'])
            return snarkjs.plonk.setup(r1cs, ptau, zkey)
        }
    }
})



window['snarkjs'] = snarkJs

import './lib/header'
import './lib/matomo'
import './lib/codeExecutor'
import './lib/web3provider'
import './lib/hardhat'
import './lib/console'
