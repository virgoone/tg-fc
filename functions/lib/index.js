"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const axios_1 = require("axios");
const express = require("express");
const cors = require("cors");
const weather_1 = require("./weather");
const app = express();
const whitelist = [/\.marryto\.me$/, /\.douni\.one$/];
app.use(cors({
    origin: whitelist,
    allowedHeaders: 'x-token,x-session,x-login',
    methods: ['GET', 'HEAD', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
    credentials: false,
}));
function sendMessage(url, token, text, chatId, parseMode) {
    const sendMessageUrl = `${url}/bot${token}/sendMessage`;
    const parseType = parseMode ? { parse_mode: parseMode } : {};
    return axios_1.default.post(sendMessageUrl, Object.assign({ text, chat_id: chatId }, parseType));
}
async function getWeatherByLocation(city) {
    const result = await weather_1.getWeather(city || 'shanghai');
    return result[0];
}
function weatherReport(result) {
    const { basic, now } = result;
    const tip = Number(now.fl) <= 10 ? 'Tips: 今天记得穿秋裤哦\n\n' : '\n';
    return (`<b>${basic.admin_area}${basic.location} 今日天气情况</b>\n\n` +
        `${tip}` +
        `<b>今日温度：</b><em>${now.tmp}℃</em>\n` +
        `<b>体感温度：</b><em>${now.fl}℃</em>\n\n` +
        `<b>天气情况：</b><em>${now.cond_txt}</em>\n` +
        `<b>风力情况：</b><em>${now.wind_sc}</em>\n` +
        `<b>风力方向：</b><em>${now.wind_dir}</em>\n` +
        `<b>云量：</b><em>${now.cloud}</em>\n` +
        `<b>降水量：</b><em>${now.pcpn}</em>\n`);
}
app.post('/tg', async (req, res) => {
    const tgConfig = functions.config().tg;
    const { message, chatId, parseMode } = req.body;
    try {
        await sendMessage(tgConfig.url, tgConfig.token, message, chatId, parseMode);
    }
    catch (error) {
        res.status(500).json({ code: 500, message: error.message || error });
    }
    res.send({ message: 'Hello from Firebase! POST' });
});
app.get('/ping', async (req, res) => {
    const { name = 'World' } = req.query;
    res.send({ message: `Hello ${name}! This message from Firebase!` });
});
app.get('/weather', async (req, res) => {
    const { city } = req.query;
    try {
        const result = await getWeatherByLocation(city || 'shanghai');
        res.send(result);
    }
    catch (error) {
        res.status(500).json({ code: 500, message: error.message || error });
    }
});
exports.push = functions.https.onRequest(app);
exports.scheduledWeatherCrontab = functions.pubsub
    .schedule('55 8 * * *')
    .timeZone('Asia/Shanghai') // Users can choose timezone - default is America/Los_Angeles
    .onRun(context => {
    console.log('08:55 AM! scheduled job ---> 获取上海市天气情况');
    getWeatherByLocation('shanghai')
        .then(async (result) => {
        const report = weatherReport(result);
        const tgConfig = functions.config().tg;
        await sendMessage(tgConfig.url, tgConfig.token, report, tgConfig.chatid, 'HTML');
    })
        .catch(error => {
        console.log('定时任务执行失败，错误原因', error);
    });
    return null;
});
//# sourceMappingURL=index.js.map