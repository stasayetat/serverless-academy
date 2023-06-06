import TelegramBot from "node-telegram-bot-api";
import axios from "axios";
//CONSTANTS
const telegramToken = '6219628835:AAFVfGQWYRK4VS8l_4JL1R7_yA_i41-eWpc';
const weatherAPIToken = '7584a6e029501f3eae2ce6e5617d0ba3';
//

const bot = new TelegramBot(telegramToken, {polling: true});

async function startBotFunction (msg) {
    await bot.sendMessage(msg.chat.id, 'Main Menu', {
        reply_markup: {
            keyboard: [['Forecast in Lviv']],
        }
    });
}

bot.onText(/\/start/, startBotFunction);

bot.onText(/^Forecast in Lviv$/, async (msg)=> {
    await bot.sendMessage(msg.chat.id, 'Weather in Lviv', {
        reply_markup: {
            keyboard: [['at intervals of 3 hours'], ['at intervals of 6 hours'], ['Back to Menu']],
        }
    });
});

bot.onText(/^at intervals of 6 hours$/, async (msg)=> {
    const res = await getForecastData()
    await bot.sendMessage(msg.chat.id, formatForecastForPrint(res.data, 6));
});

bot.onText(/^at intervals of 3 hours$/, async (msg)=> {
    const res = await getForecastData();
    await bot.sendMessage(msg.chat.id, formatForecastForPrint(res.data, 3));
});

bot.onText(/^Back to Menu$/, startBotFunction);

console.log('Bot started');

function formatForecastForPrint(data, interval) {
    let resWeather = 'Погода у Львові:\n\n';
    let dayChecker = new Date(Date.parse(data.list[0].dt_txt));
    resWeather += `${createDateMonth(dayChecker)}:\n\n`;
    data.list.forEach((item, index)=> {
        if(index % 2 === 1 && interval === 6) {
            return;
        }
        const curDate = new Date(Date.parse(item.dt_txt))
        if(dayChecker.getDate() !== curDate.getDate()) {
            resWeather += `\n${createDateMonth(curDate)}:\n\n`
            dayChecker = new Date(Date.parse(item.dt_txt));
        }
        resWeather += `\t\t${dateLessTen(curDate.getHours())}:00, ${item.main.temp}°C - відчувається як ${item.main.feels_like}°C, ${item.weather[0].description}\n`;
    });
    return resWeather;
}

function createDateMonth(date) {
    let result = '';
    result += dateLessTen(date.getDate());
    result += '-';
    if(date.getMonth() < 10) {
        result += `0${date.getMonth()+1}`;
    } else {
        result += `${date.getMonth()+1}`;
    }
    return result;
}

function dateLessTen(value) {
    let result = '';
    if(value < 10) {
        result += `0${value}`;
    } else {
        result += `${value}`;
    }
    return result;
}

async function getForecastData() {
    return axios.get('https://api.openweathermap.org/data/2.5/forecast', {
        params: {
            q: 'Lviv',
            appid: weatherAPIToken,
            mode: 'json',
            units: 'metric',
            lang: 'ua',
        }
    });
}