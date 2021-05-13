const EC = require("elliptic").ec;
const SHA256 = require("crypto-js/sha256");

exports.createWallet = function () {
  console.log("CREATING WALLET");
  const ec = new EC("secp256k1");
  const key = ec.genKeyPair();
  const wallet = {
    privateKey: key.getPrivate().toString(16),
    public: key.getPublic().encode("hex"),
    balance: 100,
  };
  return wallet;
};

exports.sign = function (privateKey, publicKey, amount) {
  const ec = new EC("secp256k1");

  const key = ec.keyFromPrivate(privateKey);
  const txn = `SEND|${publicKey}|${amount}`;
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

exports.verify = function (publicKey, txnString, signature) {
  const ec = new EC("secp256k1");
  const key = ec.keyFromPublic(publicKey, "hex");
  const txnHash = SHA256(txnString).toString();
  return key.verify(txnHash, signature);
};
