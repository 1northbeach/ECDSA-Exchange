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
  startMining: function (_, callback) {
    callback(null, "Started Mining!");
    startMining();
  },
  stopMining: function (_, callback) {
    callback(null, "Stopped Mining!");
    stopMining();
  },
  getBalance: function ([address], callback) {
    const ourUTXOs = utxos.filter((x) => {
      return x.owner === address && !x.spent;
    });
    const sum = ourUTXOs.reduce((p, c) => p + c.amount, 0);
    callback(null, `Balance for ${address}: ${sum}`);
  },
});

app.use(jsonParser());
app.use(function (req, res, next) {
  const request = req.body;
  // <- here we can check headers, modify the request, do logging, etc
  server.call(request, function (err, response) {
    if (err) {
      // if err is an Error, err is NOT a json-rpc error
      if (err instanceof Error) return next(err);
      // <- deal with json-rpc errors here, typically caused by the user
      res.status(400);
      res.send(err);
      return;
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
    miningOutput.push(miningEvent);
  });
  console.log("a user connected");
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
  // TODO
  console.log("POST /wallets/recover");
  let wallet = db.wallets.filter(
    (wallet) => (wallet.address = req.body.address)
  );
  res.send({ wallet });
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
  const { senderAddress, recipientAddress, amountToSend, sendersPrivateKey } =
    req.body;
  console.log(req.body);
  let amount = parseInt(amountToSend);
  let senderWallet = db.wallets.filter(
    (wallet) => wallet.address === senderAddress
  )[0];
  let recipientWallet = db.wallets.filter(
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

httpServer.listen(3042);
