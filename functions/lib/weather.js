"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const weather_1 = require("./service/weather");
function getNowWeather(location) {
    return weather_1.default
        .get('/weather/now', {
        params: {
            lang: 'zh',
            unit: 'm',
            location,
        },
    })
        .then(data => data.HeWeather6);
}
function getWeather(location) {
    return getNowWeather(location);
}
exports.getWeather = getWeather;
//# sourceMappingURL=weather.js.map