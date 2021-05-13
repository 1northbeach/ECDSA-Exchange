const jayson = require("jayson");
const jsonParser = require("body-parser").json;
const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./db");
const w = require("./wallets");
const { startMining, stopMining } = require("./mine");

const httpServer = require("http").createServer(app);
const options = {};
const io = require("socket.io")(httpServer, options);
app.use(express.json());

// localhost can have cross origin errors
// depending on the browser you use!
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000", // URL of the react (Frontend) app
  })
);

const server = new jayson.server({
  startMining: function ([address], callback) {
    callback(null, "Started Mining!");
    startMining(address);
  },
  stopMining: function ([address], callback) {
    callback(null, "Stopped Mining!");
    stopMining(address);
  },
  getBalance: function ([address], callback) {
    const ourUTXOs = utxos.filter((x) => {
      return x.owner === address && !x.spent;
    });
    const sum = ourUTXOs.reduce((p, c) => p + c.amount, 0);
    callback(null, `Balance for ${address}: ${sum}`);
  },
});

app.post("/wallets/create", (req, res) => {
  console.log("POST /wallets/create");
  let newWallet = w.createWallet();
  console.log(newWallet);
  db.wallets.push(newWallet);
  console.log("Wallet count:", db.wallets.length);
  res.send(newWallet);
});

app.post("/wallets/recover", (req, res) => {
  console.log("POST /wallets/recover");
  console.log("req.body", req.body);
  const { privateKey } = req.body;
  console.log("privateKey", privateKey);

  let wallet = db.wallets.filter((wallet) => wallet.privateKey == privateKey);
  console.log("wallet", wallet);
  res.send(wallet);
});

app.post("/wallets/getBalance", (req, res) => {
  const { walletAddress } = req.body;
  let wallet = db.wallets.filter((wallet) => wallet.public == walletAddress);
  res.status(200).json({ balance: wallet[0].balance });
});

app.get("/wallets/:address", (req, res) => {
  // TODO
  let wallet = db.wallets.filter(
    (wallet) => (wallet.address = req.body.address)
  )[0];
  res.send({ wallet });
});

app.post("/send", (req, res) => {
  console.log("POST /send");
  const { recipientAddress, amountToSend, sendersPrivateKey } = req.body;
  console.log(req.body);
  let amount = parseInt(amountToSend);
  let senderWallet = db.wallets.filter(
    (wallet) => wallet.privateKey === sendersPrivateKey
  )[0];
  let recipientWallet = db.wallets.filter(
    (wallet) => wallet.public === recipientAddress
  )[0];

  if (senderWallet.balance < amountToSend) {
    console.error("NOT ENOUGH BALANCE TO COMPLETE TXN, TXN FAILED");
    res.status(401).json({});
    return;
  }

  const sign = w.sign(sendersPrivateKey, recipientAddress, amountToSend);
  const txn = `SEND|${recipientAddress}|${amountToSend}`;

  console.log("senderWallet", senderWallet);

  const verified = w.verify(senderWallet.public, txn, sign.signature);

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

app.use(jsonParser());
app.use(function (req, res, next) {
  const request = req.body;
  // <- here we can check headers, modify the request, do logging, etc
  server.call(request, function (err, response) {
    if (err) {
      // // if err is an Error, err is NOT a json-rpc error
      // if (err instanceof Error) return next(err);
      // // <- deal with json-rpc errors here, typically caused by the user
      // res.status(400);
      // res.send(err);
      // return;
    }
    // <- here we can mutate the response, set response headers, etc
    if (response) {
      res.send(response);
    } else {
      // empty response (could be a notification)
      res.status(204);
      res.send("");
    }
  });
});

let miningOutput = [];
io.on("connection", (socket) => {
  socket.on("subscribeToMiningEvents", (interval) => {
    setInterval(() => {
      socket.emit(
        "getMiningEvent",
        miningOutput.slice(-10).sort((a, b) => b.blockNumber - a.blockNumber)
      );
    }, interval);
  });
  socket.on("miningEvent", (miningEvent) => {
    let wallet = db.wallets.filter(
      (wallet) => wallet.public == miningEvent.walletAddress
    )[0];
    wallet.balance += 10;
    miningOutput.push(miningEvent);
  });
  console.log("a user connected");
});

httpServer.listen(3042);
