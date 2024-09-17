import Web3 from 'web3'

interface RequestArguments {
    readonly method: string;
    readonly params?: readonly unknown[] | object;
}

interface ProviderRpcError extends Error {
    message: string;
    code: number;
    data?: unknown;
}

window.web3Provider = {
    sendAsync(payload: RequestArguments, callback: (error: ProviderRpcError | null, result?: any) => void) {
        window.remix.call('web3Provider', 'sendAsync', payload)
            .then((result: any) => callback(null, result))
            .catch((e: any) => callback(e))
    },
    request(args: RequestArguments): Promise<unknown> {
        return new Promise<unknown>((resolve, reject) => {
            window.remix.call('web3Provider', 'sendAsync', args)
            .then((response: any) => {
                resolve(response.result)
            })
            .catch((e: any) => reject(e))
        })
    }
}
// ts-ignore
window.provider = window.web3Provider
// ts-ignore
window.ethereum = window.web3Provider

window.web3 = new Web3(window.web3Provider)

console.log('web3 created....', window.web3)

