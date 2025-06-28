const WebSocket = require('ws');
const { postToTelegram } = require('./bot');
const { tensorCollections } = require('./collections');

let retryCount = 0;

function connectToTensor() {
  const socket = new WebSocket('wss://api.tensor.trade/socket');

  console.log("🌐 Connecting to Tensor WebSocket...");

  socket.on('open', () => {
    console.log('✅ Connected to Tensor');
    retryCount = 0;

    tensorCollections.forEach(({ id }) => {
      socket.send(JSON.stringify({
        method: "subscribe",
        params: { channel: "sales", collectionId: id }
      }));
    });
  });

  socket.on('message', (data) => {

    console.log('📩 Received message from Tensor');

    const parsed = JSON.parse(data);
    if (parsed.type === 'sale') {
      const sale = parsed.data;
      const msg = `🔥 *Sale on Tensor*\n🖼️ ${sale.nft_name}\n💰 *${sale.price} SOL*\n🔗 [View on Tensor](https://www.tensor.trade/item/${sale.mint})`;
      postToTelegram(msg);
    }
  });

  socket.on('error', (err) => {
    console.error("❌ WebSocket error:", err.message);
    socket.close();
  });

  socket.on('close', () => {
    retryCount++;
    const delay = Math.min(30000, 2000 * retryCount); // exponential backoff up to 30 sec
    console.log(`🔁 Reconnecting to Tensor in ${delay / 1000}s...`);
    setTimeout(connectToTensor, delay);
  });
}

connectToTensor();
