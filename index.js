require('dotenv').config();
const { ENABLE_TENSOR } = process.env;

if (ENABLE_TENSOR === 'true') {
  try {
    require('./tensorSocket');
  } catch (e) {
    console.error("Tensor module failed to load:", e.message);
    console.log("Continuing without Tensor socket...");
  }
}

require('./magicEdenPoll');
