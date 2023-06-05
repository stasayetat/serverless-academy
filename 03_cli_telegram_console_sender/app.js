import { Command } from "commander";
import TelegramBot from "node-telegram-bot-api";
const program = new Command();
program
    .version('0.0.1');
//CONSTANTS
process.env["NTBA_FIX_350"] = 1;
const token = '6144066570:AAHIujG4mvs2RsgwGifozdoHY9FjSD9CIHQ';
const userId = '536463802';
//

const bot = new TelegramBot(token, {polling: true});
const fileOptions = {
    contentType: 'image/jpeg',
};
program.command('send-message')
    .description('Send message to Telegram Bot')
    .argument('<message>')
    .action(async (message)=> {
        await bot.sendMessage(userId, message);
        console.log('You successfully sent message to Telegram Bot, Message: ' + message);
        process.exit();
    });

program.command('send-photo')
    .description('Send photo to Telegram Bot. Just drag and drop it console after p-flag')
    .argument('<path>')
    .action(async (path)=> {
        await bot.sendPhoto(userId, path, {}, {
            contentType: 'image/jpeg',
        });
        console.log('You successfully sent photo to Telegram Bot, Path: ' + path);
        process.exit();
    });

program.parse();
