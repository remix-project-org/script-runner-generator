'use strict'
import { NightwatchBrowser } from 'nightwatch'
import init from '../helpers/init'

module.exports = {
  "@disabled": true,
  before: function (browser: NightwatchBrowser, done: VoidFunction) {
    init(browser, done, 'http://127.0.0.1:8080?plugins=solidity,udapp', false, {
        name: 'scriptRunner',
        url: 'http://127.0.0.1:3000?template=zk',
    })
},

  'Should create semaphore workspace template #group6': function (browser: NightwatchBrowser) {
    browser
      //.clickLaunchIcon('filePanel')
      .waitForElementVisible('*[data-id="workspacesMenuDropdown"]')
      .click('*[data-id="workspacesMenuDropdown"]')
      .click('*[data-id="workspacecreate"]')
      .waitForElementPresent('*[data-id="create-semaphore"]')
      .scrollAndClick('*[data-id="create-semaphore"]')
      .modalFooterOKClick('TemplatesSelection')
      .waitForElementVisible('*[data-id="treeViewLitreeViewItemcircuits"]')
      .waitForElementVisible('*[data-id="treeViewLitreeViewItemcircuits/semaphore.circom"]')
      .waitForElementVisible('*[data-id="treeViewLitreeViewItemscripts"]')
      .waitForElementVisible('*[data-id="treeViewLitreeViewItemscripts/groth16"]')
      .waitForElementVisible('*[data-id="treeViewLitreeViewItemscripts/groth16/groth16_trusted_setup.ts"]')
      .waitForElementVisible('*[data-id="treeViewLitreeViewItemscripts/groth16/groth16_zkproof.ts"]')
      .waitForElementVisible('*[data-id="treeViewLitreeViewItemscripts/plonk"]')
      .waitForElementVisible('*[data-id="treeViewLitreeViewItemscripts/plonk/plonk_trusted_setup.ts"]')
      .waitForElementVisible('*[data-id="treeViewLitreeViewItemscripts/plonk/plonk_zkproof.ts"]')
      .waitForElementVisible('*[data-id="treeViewLitreeViewItemtemplates"]')
      .waitForElementVisible('*[data-id="treeViewLitreeViewItemtemplates/groth16_verifier.sol.ejs"]')
      .waitForElementVisible('*[data-id="treeViewLitreeViewItemtemplates/plonk_verifier.sol.ejs"]')
  },
  'Should run plonk trusted setup script for hash checker #group6': !function (browser: NightwatchBrowser) {
    browser
      .click('[data-id="treeViewLitreeViewItemscripts/plonk/plonk_trusted_setup.ts"]')
      .waitForElementPresent('[data-id="verticalIconsKindcircuit-compiler"]')
      .waitForElementVisible('[data-id="verticalIconsKindcircuit-compiler"]')
      .click('[data-id="play-editor"]')
      .pause(7000)
      .journalLastChildIncludes('plonk setup')
      .pause(10000)
      .journalLastChildIncludes('setup done')
      .waitForElementVisible('*[data-id="treeViewLitreeViewItemscripts/plonk/zk/keys/verification_key.json"]')
  },
  'Should run plonk zkproof script for hash checker #group6': !function (browser: NightwatchBrowser) {
    browser
      .click('[data-id="treeViewLitreeViewItemscripts/plonk/plonk_zkproof.ts"]')
      .waitForElementPresent('[data-id="verticalIconsKindcircuit-compiler"]')
      .waitForElementVisible('[data-id="verticalIconsKindcircuit-compiler"]')
      .click('[data-id="play-editor"]')
      .pause(2000)
      .journalLastChildIncludes('Compiling circuits/calculate_hash.circom')
      .pause(5000)
      .journalLastChildIncludes('Everything went okay')
      .pause(5000)
      .journalLastChildIncludes('zk proof validity')
      .journalLastChildIncludes('proof done.')
      .waitForElementVisible('*[data-id="treeViewLitreeViewItemscripts/plonk/zk/build/zk_verifier.sol"]')
      .waitForElementVisible('*[data-id="treeViewLitreeViewItemscripts/plonk/zk/build/input.json"]')
  }
}

const warningCircuit = `
template Multiplier2() {
  signal input a;
  signal input b;
  signal output c;
  c <== a*b;
}

component main = Multiplier2();
`

const errorCircuit = `
pragma circom 2.0.0;

template Multiplier2() {
    signal input a;
    signal input b;
    signal output c;
    c <== a*b;
 }
`

const validCircuit = `
pragma circom 2.0.0;

template Multiplier2() {
    signal input a;
    signal input b;
    signal output c;
    c <== a*b;
 }

 component main = Multiplier2();
`
