"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
exports.encrypt = (encryptOptions) => {
    if (!encryptOptions.enabled) {
        return {
            key: encryptOptions.key,
        };
    }
    const ts = parseInt(`${new Date().getTime() / 1000}`, 10);
    const str = `ts=${ts}&ttl=${encryptOptions.ttl}&uid=${encryptOptions.uid}`;
    return {
        ts,
        sig: crypto_1.createHmac('sha1', encryptOptions.key)
            .update(new Buffer(str, 'utf-8'))
            .digest('base64'),
        ttl: encryptOptions.ttl,
        uid: encryptOptions.uid,
    };
};
//# sourceMappingURL=encrypt.js.map