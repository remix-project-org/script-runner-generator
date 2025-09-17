'use strict'
import { NightwatchBrowser } from 'nightwatch'
import init from '../helpers/init'

module.exports = {
  before: function (browser: NightwatchBrowser, done: VoidFunction) {
    init(browser, done, 'http://127.0.0.1:8080?plugins=solidity,udapp', false, {
      name: 'scriptRunner',
      url: 'http://127.0.0.1:3000'
    })
  },
  'Should exec a web3 TS file to test AES-JS and CRYPTO-JS': function (browser: NightwatchBrowser) {
    browser
        .waitForElementVisible('*[data-id="treeViewLitreeViewItemscripts"]')
        .click('*[data-id="treeViewLitreeViewItemscripts"]')
        .addFile('crypto-aes.ts', { content: testScript })
        .waitForElementVisible('[data-id="compile-action"]')
        .click('[data-id="compile-action"]')
        .waitForElementContainsText('*[data-id="terminalJournal"]', 'aes-js functionality test PASSED!', 60000)
        .waitForElementContainsText('*[data-id="terminalJournal"]', 'crypto-js functionality test PASSED!', 60000)
  }
}

const testScript = `
// Importing required libraries
import * as aesjs from 'aes-js';
import * as CryptoJS from 'crypto-js';

// Test input data
const plaintext: string = "This is a test message.";
const key: Uint8Array = aesjs.utils.utf8.toBytes("1234567890123456"); // 16-byte key for AES

console.log(key)

// AES-js Test
function testAesJs(): void {
    console.log("Testing aes-js...");

    // Convert plaintext to bytes and pad to 16-byte boundary
    const textBytes: Uint8Array = aesjs.utils.utf8.toBytes(plaintext);
    const paddedTextBytes: Uint8Array = aesjs.padding.pkcs7.pad(textBytes);

    // Encrypt with AES in ECB mode
    const aesEcb = new aesjs.ModeOfOperation.ecb(key);
    const encryptedBytes: Uint8Array = aesEcb.encrypt(paddedTextBytes);
    console.log("Encrypted Bytes (aes-js):", encryptedBytes);

    // Decrypt back
    const decryptedBytes: Uint8Array = aesEcb.decrypt(encryptedBytes);
    const unpaddedDecryptedBytes: Uint8Array = aesjs.padding.pkcs7.strip(decryptedBytes);
    const decryptedText: string = aesjs.utils.utf8.fromBytes(unpaddedDecryptedBytes);
    console.log("Decrypted Text (aes-js):", decryptedText);

    if (decryptedText === plaintext) {
        console.log("aes-js functionality test PASSED!");
    } else {
        console.log("aes-js functionality test FAILED!");
    }
}

// Crypto-js Test
function testCryptoJs(): void {
    console.log("Testing crypto-js...");

    // Encrypt
    const encrypted: string = CryptoJS.AES.encrypt(plaintext, key.toString()).toString();
    console.log("Encrypted Text (crypto-js):", encrypted);

    // Decrypt back
    const decrypted = CryptoJS.AES.decrypt(encrypted, key.toString());
    const decryptedText: string = decrypted.toString(CryptoJS.enc.Utf8);
    console.log("Decrypted Text (crypto-js):", decryptedText);

    if (decryptedText === plaintext) {
        console.log("crypto-js functionality test PASSED!");
    } else {
        console.log("crypto-js functionality test FAILED!");
    }
}

(async () => {
  try {
    testCryptoJs()
    testAesJs()
  } catch (e) {
    console.log(e.message)
  }
})();`