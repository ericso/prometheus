import { Crypto } from '@peculiar/webcrypto';

const crypto = new Crypto();

// Ensure crypto is available globally with all required methods
Object.defineProperty(global, 'crypto', {
    value: crypto,
    writable: false,
    configurable: false
});

Object.defineProperty(globalThis, 'crypto', {
    value: crypto,
    writable: false,
    configurable: false
});