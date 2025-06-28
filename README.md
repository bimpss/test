# Solana NFT Sales Bot (Telegram)

A Node.js bot that reports Solana NFT sales to a Telegram group or channel using:
- ✅ Real-time Tensor WebSocket feed
- 🕑 Polling Magic Eden API

## 📦 Setup

1. Clone the repo
2. Install dependencies:
   ```
   npm install
   ```
3. Copy `.env.example` to `.env` and add your bot token and chat ID.

4. Start the bot:
   ```
   npm start
   ```

## 🧠 Notes

- Customize collections in `collections.js`
- Add bot as admin to your group/channel

## 🌐 Deploy

- Railway.app (free hosting)
- VPS + PM2:
  ```
  npm install -g pm2
  pm2 start index.js --name salesbot
  ```

