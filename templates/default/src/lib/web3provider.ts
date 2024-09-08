import Web3 from 'web3'
window.web3Provider = {
    sendAsync(payload: any, callback: any) {
        window.remix.call('web3Provider', 'sendAsync', payload)
            .then((result: any) => callback(null, result))
            .catch((e: any) => callback(e))
    }
}
// ts-ignore
window.provider = window.web3Provider
// ts-ignore
window.ethereum = window.web3Provider

window.web3 = new Web3(window.web3Provider)

console.log('web3 created....', window.web3)

