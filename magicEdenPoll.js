const axios = require('axios');
const { postToTelegram } = require('./bot');
const { magicEdenSlugs } = require('./collections');

let seen = new Set();

async function pollSales() {
  console.log("🔄 Polling Magic Eden for sales...");

  //await postToTelegram(`🧪 Test message at ${new Date().toISOString()}`); to debug

  for (const { slug } of magicEdenSlugs) {
    const url = `https://api-mainnet.magiceden.dev/v2/collections/${slug}/activities?offset=0&limit=5`;

    try {
      const res = await axios.get(url);

      const buys = res.data.filter(tx =>
        (
          (tx.type === "buyNow") ||
          (tx.type === "exchange") ||
          (tx.type === "sweep") ||
          (tx.type === "bid" && tx.buyer && tx.seller)
        ) &&
        tx.tokenMint &&
        tx.price
      );


      console.log(`✅ [${slug}] ${buys.length} new sale(s)`);

      for (const tx of buys) {
        if (seen.has(tx.signature)) continue;
        seen.add(tx.signature);

        let tokenName = tx.tokenMint.slice(0, 6) + '...';
        try {
          const metaRes = await axios.get(`https://api-mainnet.magiceden.dev/v2/tokens/${tx.tokenMint}`);
          if (metaRes.data?.name) {
            tokenName = metaRes.data.name;
          }
          if (metaRes.data?.image) {
            tokenImg = metaRes.data.image;
          }
        } catch (metaErr) {
          console.warn(`⚠️ Failed to fetch metadata for token ${tx.tokenMint}:`, metaErr.message);
        }

        const msg = `😲 *Sale on Magic Eden (${tx.type}) 😲*

🖼️ *${tokenName}*
💰 *${tx.price} SOL*

🔗 [(View on Magic Eden)](https://magiceden.io/item-details/${tx.tokenMint}) 🔍 [(View Full Res)](${tokenImg})

*Buyer:*
\`${tx.buyer}\`
🔗 [Solscan](https://solscan.io/account/${tx.buyer})

*Seller:*
\`${tx.seller}\`
🔗 [Solscan](https://solscan.io/account/${tx.seller})

🄳🄾 🅈🄾🅄 🫵 🄽🄴🄴🄳 🄰 🄱🄾🅃 🄻🄸🄺🄴 🅃🄷🄸🅂 🙋
🅂🄿🄴🄰🄺 🅃🄾 🄱🄸🄼🄿🅂 🫡
`;


        try {
          await postToTelegram(msg);
          console.log("📤 Posted sale to Telegram.");
        } catch (e) {
          console.error("❌ Failed to post to Telegram:", e.message);
        }

      }

      if (seen.size > 100) {
        seen = new Set([...seen].slice(-50));
      }

    } catch (err) {
      console.error(`❌ Error polling Magic Eden [${slug}]:`, err.message);

      if (err.response && err.response.status === 503) {
        console.log("⏳ Magic Eden API returned 503. Delaying for 15 seconds...");
        await new Promise(resolve => setTimeout(resolve, 100000));
      }
    }
  }
}

setInterval(pollSales, 50000);