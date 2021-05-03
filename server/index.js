const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const w = require("./wallets");

// localhost can have cross origin errors
// depending on the browser you use!
app.use(cors());
app.use(express.json());

let wallets = [];

app.post("/wallets/create", (req, res) => {
  console.log("POST /wallets/create");
  let newWallet = w.createWallet();
  console.log(newWallet);
  wallets.push(newWallet);
  console.log("Wallet count:", wallets.length);
  res.send(newWallet);
});

app.post("/wallets/recover", (req, res) => {
  // TODO
  console.log("POST /wallets/recover");
  let wallet = wallets.filter((wallet) => (wallet.address = req.body.address));
  res.send({ wallet });
});

app.get("/wallets/:address", (req, res) => {
  // TODO
  let wallet = wallets.filter(
    (wallet) => (wallet.address = req.body.address)
  )[0];
  res.send({ wallet });
});

app.post("/send", (req, res) => {
  console.log("POST /send");
  const {
    senderAddress,
    recipientAddress,
    amountToSend,
    sendersPrivateKey,
  } = req.body;
  console.log(req.body);
  let amount = parseInt(amountToSend);
  let senderWallet = wallets.filter(
    (wallet) => wallet.address === senderAddress
  )[0];
  let recipientWallet = wallets.filter(
    (wallet) => wallet.address === recipientAddress
  )[0];

  if (senderWallet.balance < amountToSend) {
    console.error("NOT ENOUGH BALANCE TO COMPLETE TXN, TXN FAILED");
    res.status(401).json({});
    return;
  }

  const sign = w.sign(sendersPrivateKey, recipientAddress, amountToSend);
  const txn = `SEND|${recipientAddress}|${amountToSend}`;

  const verified = w.verify(
    senderWallet.publicX,
    senderWallet.publicY,
    txn,
    sign.signature
  );

  if (verified) {
    console.log("VERIFIED, TXN PROCESSING!");
    senderWallet.balance -= amount;
    recipientWallet.balance = (recipientWallet.balance || 0) + amount;
    console.log("senderWallet.balance", senderWallet.balance);
    res.send({ balance: senderWallet.balance });
  } else {
    console.error("UNVERIFIED, TXN FAILED");
    res.status(401).json({});
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
