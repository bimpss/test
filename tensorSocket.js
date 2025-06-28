const WebSocket = require('ws');
const { postToTelegram } = require('./bot');
const { tensorCollections } = require('./collections');

const socket = new WebSocket('wss://api.tensor.trade/socket');

socket.on('open', () => {
  console.log('✅ Connected to Tensor');

  tensorCollections.forEach(({ id }) => {
    socket.send(JSON.stringify({
      method: "subscribe",
      params: {
        channel: "sales",
        collectionId: id
      }
    }));
  });
});

socket.on('message', (data) => {
  const parsed = JSON.parse(data);
  if (parsed.type === 'sale') {
    const sale = parsed.data;
    const msg = `🔥 *Sale on Tensor*
🖼️ ${sale.nft_name}
💰 *${sale.price} SOL*
🔗 [View on Tensor](https://www.tensor.trade/item/${sale.mint})`;
    postToTelegram(msg);
  }
});
