import "@babel/polyfill"
import { waffleChai } from "@ethereum-waffle/chai";
import * as path from 'path'

const chai = require('chai')
chai.use(waffleChai)

window.chai = chai
