// Global polyfill for crypto.randomUUID to fix TypeORM compatibility
if (typeof globalThis.crypto === 'undefined') {
  const crypto = require('crypto');
  (globalThis as any).crypto = {
    randomUUID: () => crypto.randomUUID(),
    getRandomValues: (arr: any) => crypto.getRandomValues(arr),
    subtle: crypto.webcrypto?.subtle || {},
  };
}
