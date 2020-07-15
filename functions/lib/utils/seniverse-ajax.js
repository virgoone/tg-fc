"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const functions = require("firebase-functions");
const encrypt_1 = require("./encrypt");
const baseURL = 'https://api.seniverse.com';
const seniverseConfig = functions.config().seniverse;
function validateStatus(status) {
    return status >= 200 && status < 400;
}
function onFulfilledInterceptor(response) {
    return response.data;
}
function onRejectedInterceptor(error) {
    if (error.response) {
        const { data = {} } = error.response;
        error.reason = data.message || data.error || data.details;
        error.httpCode = error.response.status;
        error.code = data.code || data.status_code || data.error_code || error.code;
    }
    throw error;
}
function createRequestInterceptor(config) {
    const { method } = config;
    if (/get/i.test(method)) {
        let { params } = config;
        params = Object.assign({}, params || {}, encrypt_1.encrypt({
            key: seniverseConfig.privatekey || 'SFBiJp95mFZf6b9s8',
            enabled: true,
            uid: seniverseConfig.publickey || 'PGY-x_69uxh3I3wJo',
        }));
        return Object.assign(Object.assign({}, config), { params });
    }
    return config;
}
const axiosInstance = axios_1.default.create({
    baseURL,
    timeout: 10000,
    validateStatus,
});
axiosInstance.interceptors.response.use(onFulfilledInterceptor, onRejectedInterceptor);
axiosInstance.interceptors.request.use(createRequestInterceptor);
exports.default = axiosInstance;
//# sourceMappingURL=seniverse-ajax.js.map