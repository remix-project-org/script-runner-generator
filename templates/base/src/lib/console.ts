import { isBigInt } from 'web3-validator';

const replacer = (key: string, value: any) => {
  if (isBigInt(value)) return value.toString(); // Convert BigInt to string
  if (typeof value === 'function') return undefined; // Remove functions
  if (value instanceof Error) {
    return {
      message: value.message,
      name: value.name,
      stack: value.stack,
    }; // Properly serialize Error objects
  }
  return value;
};

const wrapConsoleMethod = (method: 'log' | 'info' | 'warn' | 'error') => {
  const original = console[method].bind(console);
  console[method] = function (...args: any[]) {
    window.remix.emit(method, {
      data: args.map(el => JSON.parse(JSON.stringify(el, replacer))),
    });
    original(...args);
  };
};

wrapConsoleMethod('log');
wrapConsoleMethod('info');
wrapConsoleMethod('warn');
wrapConsoleMethod('error');