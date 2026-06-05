const express = require('express');
const TronWeb = require('tronweb');
const app = express();
app.use(express.json());

const tronWeb = new TronWeb({
  fullHost: 'https://api.trongrid.io',
  headers: { "TRON-PRO-API-KEY": process.env.TRONGRID_API_KEY },
  privateKey: process.env.PRIVATE_KEY
});

const USDT_CONTRACT = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';

app.post('/send-usdt', async (req, res) => {
  const { toAddress, amount } = req.body;
  const contract = await tronWeb.contract().at(USDT_CONTRACT);
  const result = await contract.transfer(
    toAddress,
    amount * 1_000_000  // USDT has 6 decimals
  ).send();
  res.json({ success: true, txHash: result });
});

app.listen(process.env.PORT || 3000);
