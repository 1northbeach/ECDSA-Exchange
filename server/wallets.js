const EC = require("elliptic").ec;
const SHA256 = require("crypto-js/sha256");

exports.createWallet = function () {
  const ec = new EC("secp256k1");

  const key = ec.genKeyPair();
  const address = SHA256(
    `${key.getPublic().x.toString(16)}${key.getPublic().y.toString(16)}`
  ).toString();
  const wallet = {
    privateKey: key.getPrivate().toString(16),
    address: address,
    publicX: key.getPublic().x.toString(16),
    publicY: key.getPublic().y.toString(16),
    balance: 100,
  };
  return wallet;
};

exports.sign = function (privateKey, address, amount) {
  const ec = new EC("secp256k1");

  const key = ec.keyFromPrivate(privateKey);
  const txn = `SEND|${address}|${amount}`;
  const txnHash = SHA256(txn).toString();
  const signature = key.sign(txnHash);

  return {
    txn,
    signature: {
      r: signature.r.toString(16),
      s: signature.s.toString(16),
    },
  };
};

exports.verify = function (publicX, publicY, txnString, signature) {
  const ec = new EC("secp256k1");
  const publicKey = {
    x: publicX,
    y: publicY,
  };
  const key = ec.keyFromPublic(publicKey, "hex");
  const txnHash = SHA256(txnString).toString();

  return key.verify(txnHash, signature);
};
