"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const functions = require("firebase-functions");
const ajax_1 = require("../utils/ajax");
const key_sort_1 = require("../utils/key-sort");
exports.default = ajax_1.default({
    baseURL: 'https://free-api.heweather.net/s6',
}, {
    auth: true,
    requestAuth: data => {
        const config = functions.config().weather;
        const username = config.username;
        const key = config.key;
        const t = Math.floor(Date.now() / 1000);
        const params = Object.assign(Object.assign({}, data), { username,
            key,
            t });
        const sortParams = key_sort_1.keySort(params);
        let str = '';
        Object.keys(sortParams).forEach(key => {
            const value = sortParams[key];
            if (value !== '' && key !== 'key') {
                str += `${key}=${encodeURIComponent(value)}&`;
            }
        });
        str = str.substr(0, str.length - 1);
        str += key;
        const sign = crypto_1.createHash('md5', { encoding: 'utf-8' })
            .update(str)
            .digest('hex');
        return new Promise((resolve, reject) => {
            resolve({ sign, t, username });
        });
    },
});
//# sourceMappingURL=weather.js.map