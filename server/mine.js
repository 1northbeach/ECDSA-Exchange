const db = require("./db");
const UTXO = require("./models/UTXO");
const Transaction = require("./models/Transaction");
const Block = require("./models/Block");
const TARGET_DIFFICULTY = BigInt("0x00000" + "F".repeat(61));
const { PUBLIC_KEY, PRIVATE_KEY } = require("./config");
const io = require("socket.io-client");
const socket = io("http://localhost:3042");

let mining = false;
const BLOCK_REWARD = 10;

const miners = {};
function startMining(walletAddress) {
  miners[walletAddress] = true;
  console.log("miners", miners);
  mine(walletAddress);
}

function stopMining(walletAddress) {
  miners[walletAddress] = false;
  console.log("miners", miners);
}

function mine(walletAddress) {
  if (!miners[walletAddress]) return;

  const block = new Block();

  const coinbaseUTXO = new UTXO(walletAddress, BLOCK_REWARD);
  const coinbaseTX = new Transaction([], [coinbaseUTXO]);
  block.addTransaction(coinbaseTX);

  while (BigInt("0x" + block.hash()) >= TARGET_DIFFICULTY) {
    block.nonce++;
  }

  block.execute();

  db.blockchain.addBlock(block);
  socket.emit("miningEvent", {
    blockNumber: db.blockchain.blockHeight(),
    hash: block.hash(),
    nonce: block.nonce,
    walletAddress: walletAddress,
  });
  console.log(
    `mined block #${db.blockchain.blockHeight()} with a hash of ${block.hash()} at nonce ${
      block.nonce
    }. 10ETH rewarded to ${walletAddress}`
  );
  setTimeout(mine, 5000, walletAddress);
}

module.exports = {
  startMining,
  stopMining,
};
