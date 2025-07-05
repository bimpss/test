const axios = require('axios');
require('dotenv').config();

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

if (!TELEGRAM_TOKEN || !CHAT_ID) {
  console.error("❌ Missing Telegram config. Check TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in .env");
  process.exit(1);
}

const CHAT_IDS = CHAT_ID.split(',').map(id => id.trim());

const postToTelegram = async (message) => {
  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

  for (const chatId of CHAT_IDS) {
    try {
      const res = await axios.post(url, {
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown" // Remove this line if you're seeing Markdown errors
      });
      console.log("📤 Telegram message sent.");
    } catch (err) {
      console.error("❌ Telegram post failed:", err.response?.data || err.message);
    }
  }
};

module.exports = { postToTelegram };