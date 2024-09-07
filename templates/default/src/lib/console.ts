import { isBigInt } from 'web3-validator'
const replacer = (key: string, value: any) => {
    if (isBigInt(value)) value = value.toString()
    if (typeof value === 'function') value = value.toString()
    return value
  }
  (console as any).logInternal = console.log
  console.log = function () {
     window.remix.emit('log', {
       data: Array.from(arguments).map((el) => JSON.parse(JSON.stringify(el, replacer)))
     })
   };
  
  (console as any).infoInternal = console.info;
  console.info = function () {
    window.remix.emit('info', {
      data: Array.from(arguments).map((el) => JSON.parse(JSON.stringify(el, replacer)))
    })
  };
  
  (console as any).warnInternal = console.warn
  console.warn = function () {
    window.remix.emit('warn', {
      data: Array.from(arguments).map((el) => JSON.parse(JSON.stringify(el, replacer)))
    })
  };
  
  (console as any).errorInternal = console.error
  console.error = function () {
    window.remix.emit('error', {
      data: Array.from(arguments).map((el) => JSON.parse(JSON.stringify(el, replacer)))
    })
  }