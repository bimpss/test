const axios = require('axios');
const { postToTelegram } = require('./bot');
const { magicEdenSlugs } = require('./collections');

let seen = new Set();

async function pollSales() {
  console.log("🔄 Polling Magic Eden for sales...");

  for (const { slug } of magicEdenSlugs) {
    const url = `https://api-mainnet.magiceden.dev/v2/collections/${slug}/activities?offset=0&limit=5`;

    try {
      const res = await axios.get(url);
      const buys = res.data.filter(tx => ["buyNow", "exchange", "sweep"].includes(tx.type));

      console.log(`✅ [${slug}] ${buys.length} new sale(s)`);

      for (const tx of buys) {
        if (seen.has(tx.signature)) continue;
        seen.add(tx.signature);

        const msg = `💎 *Sale on Magic Eden*
🖼️ Token: ${tx.tokenMint.slice(0, 6)}...
💰 *${tx.price} SOL*
🔗 [View](https://magiceden.io/item-details/${tx.tokenMint})`;

        await postToTelegram(msg);
      }

      if (seen.size > 100) {
        seen = new Set([...seen].slice(-50));
      }

    } catch (err) {
      console.error(`❌ Error polling Magic Eden [${slug}]:`, err.message);
    }
  }
}

setInterval(pollSales, 10000);