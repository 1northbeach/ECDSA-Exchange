const SHA256 = require("crypto-js/sha256");

class Block {
  constructor() {
    this.timestamp = Date.now();
    this.nonce = 0;
    this.transactions = [];
  }

  hash() {
    return SHA256(
      `${this.timestamp}${this.nonce}${JSON.stringify(this.transactions)}`
    ).toString();
  }

  addTransaction(tx) {
    this.transactions.push(tx);
  }

  execute() {
    this.transactions.forEach((tx) => tx.execute());
  }
}

module.exports = Block;
