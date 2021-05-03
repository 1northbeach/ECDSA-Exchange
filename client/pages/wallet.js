import Layout from "../components/layout";
import Head from "next/head";
import { useEffect, useState } from "react";

export default function Wallet() {
  const [wallet, setWallet] = useState({});
  const [publicX, setPublicX] = useState(null);
  const [publicY, setPublicY] = useState(null);
  const [address, setAddress] = useState(null);
  const [privateKey, setPrivateKey] = useState(null);
  const [balance, setBalance] = useState(0);
  const [walletReady, setWalletReady] = useState(false);
  const recoverWallet = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ACTION_TYPE: "RECOVER",
          privateKey: privateKey,
          publicX: publicX,
          publicY: publicY,
        }),
      });
      setPrivateKey(res.privateKey);
      setPublicX(res.publicX);
      setPublicY(res.publicY);
      setBalance(res.balance);
      setAddress(res.address);
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
    setPublicX(wallet.publicX);
    setPublicY(wallet.publicY);
    setBalance(wallet.balance);
    setAddress(wallet.address);
  }, [wallet, walletReady]);

  const handleChange = (input) => (event) => {
    const value = event.target.value;
    switch (input) {
      case "privateKey":
        setPrivateKey(value);
        break;
      case "publicX":
        setPublicX(value);
        break;
      case "publicY":
        setPublicY(value);
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

      <p>Balance: {balance} ETH</p>
      <p>Address: {address}</p>
      <p>
        <button className="btn btn-secondary m-1" onClick={createWallet}>
          Create
        </button>
        {/* <button className="btn btn-secondary m-1" onClick={recoverWallet}>
          Recover
        </button> */}
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
                  <span className="input-group-text">X</span>
                </div>
                <input
                  className="form-control"
                  type="text"
                  value={publicX}
                  onChange={handleChange("publicX")}
                />
              </div>
            </td>
          </tr>
          <tr>
            <td>
              {" "}
              <div className="input-group p-1">
                <div className="input-group-prepend">
                  <span className="input-group-text">Y</span>
                </div>
                <input
                  className="form-control"
                  type="text"
                  value={publicY}
                  onChange={handleChange("publicY")}
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </Layout>
  );
}
