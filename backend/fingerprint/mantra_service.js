const axios = require('axios');

async function captureFingerprint() {
  const response = await axios.post('http://127.0.0.1:11100/capture', {
    // Example payload - adjust according to your Mantra RD service documentation
  });
  if (response.data && response.data.Data) {
    return response.data.Data;
  } else {
    throw new Error('Fingerprint capture failed');
  }
}

module.exports = { captureFingerprint };
