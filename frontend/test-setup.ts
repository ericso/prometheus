import { webcrypto } from 'node:crypto'

// Polyfill crypto for Node.js environment
Object.defineProperty(globalThis, 'crypto', {
    value: webcrypto
})