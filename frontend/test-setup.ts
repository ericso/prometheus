import * as nodeCrypto from 'crypto'

if (!global.crypto) {
    global.crypto = require('crypto')
}

global.crypto.getRandomValues = <T extends ArrayBufferView | null>(array: T): T => {
    if (array === null) return array
    const bytes = nodeCrypto.randomBytes(array.byteLength)
    const view = array as unknown as Uint8Array
    for (let i = 0; i < bytes.length; i++) {
        view[i] = bytes[i]
    }
    return array
}