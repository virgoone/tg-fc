"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
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
    console.log(error);
    throw error;
}
function createRequestInterceptor(options = {}) {
    return async (config) => {
        if (!options.auth) {
            return config;
        }
        const { method } = config;
        let { params, data } = config;
        let authData = {};
        if (options.requestAuth) {
            authData = await options.requestAuth(params || data);
        }
        if (/get/i.test(method)) {
            params = Object.assign(Object.assign({}, authData), params);
            return Object.assign(Object.assign({}, config), { params });
        }
        data = Object.assign(Object.assign({}, authData), data);
        return Object.assign(Object.assign({}, config), { data });
    };
}
function ajax(config, options) {
    const { baseURL } = config, rest = __rest(config, ["baseURL"]);
    const axiosInstance = axios_1.default.create(Object.assign({ baseURL, timeout: 10000, validateStatus }, rest));
    axiosInstance.interceptors.response.use(onFulfilledInterceptor, onRejectedInterceptor);
    axiosInstance.interceptors.request.use(createRequestInterceptor(options));
    return axiosInstance;
}
exports.default = ajax;
//# sourceMappingURL=ajax.js.map