const Blockchain = require("./models/Blockchain");

const db = {
  blockchain: new Blockchain(),
  utxos: [],
  wallets: [],
};

module.exports = db;
