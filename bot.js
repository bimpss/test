const axios = require('axios');
require('dotenv').config();

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

if (!TELEGRAM_TOKEN || !CHAT_ID) {
  console.error("❌ Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID in environment.");
  process.exit(1);
}

(async () => {
  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

  try {
    const response = await axios.post(url, {
      chat_id: CHAT_ID,
      text: `🧪 Test message from debug.js at ${new Date().toISOString()}`
      // Don't set parse_mode here to avoid markdown issues
    });

    console.log("✅ Telegram response:");
    console.dir(response.data, { depth: null });
  } catch (err) {
    console.error("❌ Error sending Telegram message:");
    if (err.response) {
      console.error(err.response.data);
    } else {
      console.error(err.message);
    }
  }
})();
