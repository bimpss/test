require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });

function postToTelegram(message) {
  return bot.sendMessage(process.env.TELEGRAM_CHAT_ID, message, {
    parse_mode: "Markdown",
    disable_web_page_preview: false,
  });
}

module.exports = { postToTelegram };
