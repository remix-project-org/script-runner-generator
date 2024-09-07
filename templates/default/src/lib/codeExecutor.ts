import { createClient } from '@remixproject/plugin-iframe'
import { PluginClient } from '@remixproject/plugin'
import { TranspileOutput } from "typescript"
import * as path from 'path'
import './runWithMocha'
import { fileContents, scriptReturns } from '.';
declare global {
  interface Window {
    [key: string]: any;
    require: any;
  }
}

class CodeExecutor extends PluginClient {
  async execute (script: string, filePath: string) {
    filePath = filePath || 'scripts/script.ts'
    const paths = filePath.split('/')
    paths.pop()
    const fromPath = paths.join('/') // get current execcution context path
    if (script) {
      try {
        const ts = await import('typescript');
        const transpiled: TranspileOutput = ts.transpileModule(script, { moduleName: filePath, fileName: filePath,
        compilerOptions: {
         target: ts.ScriptTarget.ES2015,
         module: ts.ModuleKind.CommonJS,
         esModuleInterop: true,  
        }});
        script = transpiled.outputText;
        // extract all the "require", execute them and store the returned values.
        const regexp = /require\((.*?)\)/g
        const array = [...script.matchAll(regexp)];

        for (const regex of array) {
          let file = regex[1]
          file = file.slice(0, -1).slice(1) // remove " and '
          let absolutePath = file
          if (file.startsWith('./') || file.startsWith('../')) {            
            absolutePath = path.resolve(fromPath, file)
          }
          if (!scriptReturns[fromPath]) scriptReturns[fromPath] = {}
          if (!fileContents[fromPath]) fileContents[fromPath] = {}
          const { returns, content } = await this.executeFile(absolutePath)
          scriptReturns[fromPath][file] = returns
          fileContents[fromPath][file] = content
        }

        // execute the script
        script = `const exports = {};
                  const module = { exports: {} }
                  window.__execPath__ = "${fromPath}"
                  ${script};
                  return exports || module.exports`
        const returns = (new Function(script))()
        if (mocha.suite && ((mocha.suite.suites && mocha.suite.suites.length) || (mocha.suite.tests && mocha.suite.tests.length))) {
          console.log(`RUNS ${filePath}....`)
          mocha.run()
        } 
        return returns
      } catch (e: any) {
        this.emit('error', {
          data: [e.message]
        })
      }
    }
  }

  async _resolveFile (fileName: string) {
    if (await this.call('fileManager' as any, 'exists', fileName)) return await this.call('fileManager', 'readFile', fileName)
    if (await this.call('fileManager' as any, 'exists', fileName + '.ts')) return await this.call('fileManager', 'readFile', fileName + '.ts')
    if (await this.call('fileManager' as any, 'exists', fileName + '.js')) return await this.call('fileManager', 'readFile', fileName + '.js')
  }

  async executeFile (fileName: string) {
    try {
      if (require(fileName)) return require(fileName)
    } catch (e) {}
    const content = await this._resolveFile(fileName) || ''
    const returns = await this.execute(content, fileName)
    return {returns, content}
  }
}

window.remix = new CodeExecutor()
createClient(window.remix)