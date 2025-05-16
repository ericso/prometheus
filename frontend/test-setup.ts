import { webcrypto } from 'node:crypto'

// Create a more complete crypto polyfill
const cryptoPolyfill = {
    ...webcrypto,
    getRandomValues: function(buffer) {
        return webcrypto.getRandomValues(buffer);
    }
};

// Ensure crypto is available globally
if (!global.crypto) {
    Object.defineProperty(global, 'crypto', {
        value: cryptoPolyfill,
        writable: false,
        configurable: false
    });
}

// Also ensure it's available on globalThis
if (!globalThis.crypto) {
    Object.defineProperty(globalThis, 'crypto', {
        value: cryptoPolyfill,
        writable: false,
        configurable: false
    });
}