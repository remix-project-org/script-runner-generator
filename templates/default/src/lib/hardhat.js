import * as hhEtherMethods from './hardhat-ethers/methods'
import * as ethersJs from 'ethers' // eslint-disable-line

// Support hardhat-ethers, See: https://hardhat.org/plugins/nomiclabs-hardhat-ethers.html
const { ethers } = ethersJs
ethers.provider = new ethers.providers.Web3Provider(window.web3Provider)
window.hardhat = { ethers }
for(const method in hhEtherMethods) Object.defineProperty(window.hardhat.ethers, method, { value: hhEtherMethods[method]})