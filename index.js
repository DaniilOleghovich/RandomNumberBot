const TelegramApi = require('node-telegram-bot-api');
const {gameOptions, startGameAgainOptions} = require('./options');
const config = require('dotenv').config();

const apiToken = process.env.API_TOKEN;

const bot = new TelegramApi(apiToken, {polling: true});

const chats = {};

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Я загадаю рандомное число от 0 до 9, а ты должен его угадать!`);
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    console.log(chats);
    await bot.sendMessage(chatId, 'Отгадывай!:)', gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Информация о боте'},
        {command: '/game', description: 'Начало игры'},
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        const userFirstName = msg.from.first_name ? msg.from.first_name : '';
        const userLastName = msg.from.last_name ? msg.from.last_name : '';

        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://chpic.su/_data/stickers/l/lennyvk/lennyvk_001.webp?v=1713961266');
            return bot.sendMessage(chatId, `Приветствую, ${userFirstName} ${userLastName}`);
        }

        if (text === '/info') {
            return bot.sendMessage(chatId, `Этот бот - простая игра, в которой тебе нужно угадать загаданное число`);
        }

        if (text === '/game') {
            return startGame(chatId);
        }

        return bot.sendMessage(chatId, `Я тебя не понимаю, введи валидное название команды!`);
    });

    bot.on('callback_query', msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;

        if (data === '/again') {
            return startGame(chatId);
        }

        if (data === chats[chatId].toString()) {
            return bot.sendMessage(chatId, `Поздравляем, ты угадал цифру!`, startGameAgainOptions)
        } else {
            return bot.sendMessage(chatId, `К сожалению ты не угадал/а. Загаданная цифра: ${chats[chatId]}`, startGameAgainOptions)
        }
    })

}

start();


