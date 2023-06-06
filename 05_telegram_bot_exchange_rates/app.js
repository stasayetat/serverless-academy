import TelegramBot from 'node-telegram-bot-api';
import axios from "axios";
import NodeCache from "node-cache";
//CONSTANTS
const telegramToken = '6103955394:AAFA7QJUe35XC3lZ_Lv53XOOZXMP7OV-GSg';
//

const bot = new TelegramBot(telegramToken, {polling: true});
const myCache = new NodeCache();
async function startCommand(msg) {
    await bot.sendMessage(msg.chat.id, 'Menu', {
        reply_markup: {
            keyboard: [['Курси валют']]
        }
    });
}

bot.onText(/\/start/, startCommand);

bot.onText(/^Курси валют$/, async (msg)=> {
    await bot.sendMessage(msg.chat.id, 'Оберіть валюту', {
        reply_markup: {
            keyboard: [['USD'], ['EUR'], ['Back to menu']]
        }
    });
});

bot.onText(/^Back to menu$/, startCommand);

bot.onText(/^USD$/, async (msg)=> {
    const res = await getExchangeData('USD');
    await bot.sendMessage(msg.chat.id, res);
});

bot.onText(/^EUR$/, async (msg)=> {
    const res = await getExchangeData('EUR');
    await bot.sendMessage(msg.chat.id, res);
});
console.log('Bot started');

async function getExchangeData(currency) {
    if(!myCache.has(`private${currency}`)) {
        const privateRes = await axios.get('https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11');
        const privateUSD = privateRes.data.find((item)=> item.ccy === 'USD');
        const privateEUR = privateRes.data.find((item)=> item.ccy === 'EUR');
        myCache.mset([
            {key: 'privateUSD', val: privateUSD, ttl: 60},
            {key: 'privateEUR', val: privateEUR, ttl: 60},
        ]);
    }
    let privateData = myCache.get(`private${currency}`);

    if(!myCache.has(`mono${currency}`)) {
        let monoRes;
        try {
            monoRes = await axios.get('https://api.monobank.ua/bank/currency');
        } catch (e) {
            console.log('Error with monoAPI, wait a minute');
            return 'Error with monoAPI, wait a minute';
        }
        const monoUSD = monoRes.data.find((item)=> item.currencyCodeA === 840);
        const monoEUR = monoRes.data.find((item)=> item.currencyCodeA === 978);
        myCache.mset([
            {key: 'monoUSD', val: monoUSD, ttl: 70},
            {key: 'monoEUR', val: monoEUR, ttl: 70},
        ]);
    }
    let monoData = myCache.get(`mono${currency}`);
    return formatExchangeToPrint(currency, privateData, monoData);
}

function formatExchangeToPrint(currency, privateBankPrices, monoBankPrices) {
    let resultMessage = `Курс ${currency} / UAH:\n\n`;
    resultMessage += `PrivatBank:\n\t\tКупити: ${privateBankPrices.buy} ГРН\n`;
    resultMessage += `\t\tПродати: ${privateBankPrices.sale} ГРН\n\n`;

    resultMessage += `MonoBank:\n\t\tКупити: ${monoBankPrices.rateBuy} ГРН\n`;
    resultMessage += `\t\tПродати: ${monoBankPrices.rateSell} ГРН`;

    return resultMessage;
}

