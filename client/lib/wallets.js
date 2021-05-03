const EC = require("elliptic").ec;
const SHA256 = require("crypto-js/sha256");
// NOT USED, DONE SERVER SIDE
export default function createWallet() {
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
}
