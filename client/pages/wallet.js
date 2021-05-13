import Layout from "../components/layout";
import Head from "next/head";
import { useEffect, useState } from "react";

export default function Wallet() {
  const [wallet, setWallet] = useState({});
  const [publicAddress, setPublicAddress] = useState(null);
  const [privateKey, setPrivateKey] = useState(null);
  const [balance, setBalance] = useState(0);
  const [walletReady, setWalletReady] = useState(false);

  const recoverWallet = async (e) => {
    e.preventDefault();
    try {
      console.log(privateKey);
      const res = await fetch("http://localhost:3000/api/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ACTION_TYPE: "RECOVER",
          privateKey: privateKey,
        }),
      });
      let wallet = await res.json();
      console.log(wallet);
      if (wallet[0]) {
        setPrivateKey(wallet[0].privateKey);
        setPublicAddress(wallet[0].public);
        setBalance(wallet[0].balance);
      }
    } catch (error) {
      console.error("error!", error);
    }
  };

  const createWallet = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ACTION_TYPE: "CREATE" }),
      });
      let wallet = await res.json();
      setWallet(wallet);
      setWalletReady(true);
    } catch (error) {
      console.error("error!", error);
    }
  };

  useEffect(() => {
    setPrivateKey(wallet.privateKey);
    setPublicAddress(wallet.public);
    setBalance(wallet.balance);
  }, [wallet, walletReady]);

  const handleChange = (input) => (event) => {
    const value = event.target.value;
    switch (input) {
      case "privateKey":
        setPrivateKey(value);
        break;
      case "publicAddress":
        setPublicAddress(value);
        break;
      default:
        break;
    }
  };

  return (
    <Layout>
      <Head>
        <title>1Ethereum - Wallet</title>
      </Head>
      <h1 className="cover-heading">Wallet</h1>
      <p className="lead">Balance: {balance || 0} ETH</p>
      <p className="lead">
        <button className="btn btn-secondary m-1" onClick={createWallet}>
          Create
        </button>
        <button className="btn btn-secondary m-1" onClick={recoverWallet}>
          Recover
        </button>
      </p>
      <table className="table table-hover table-bordered table-dark">
        <tbody>
          <tr>
            <td>
              {" "}
              <div className="input-group p-1">
                <div className="input-group-prepend">
                  <span className="input-group-text">PVT</span>
                </div>
                <input
                  className="form-control"
                  type="text"
                  value={privateKey}
                  onChange={handleChange("privateKey")}
                />
              </div>
            </td>
          </tr>
          <tr>
            <td>
              {" "}
              <div className="input-group p-1">
                <div className="input-group-prepend">
                  <span className="input-group-text">PUB</span>
                </div>
                <input
                  className="form-control"
                  type="text"
                  value={publicAddress}
                  onChange={handleChange("publicAddress")}
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </Layout>
  );
}
