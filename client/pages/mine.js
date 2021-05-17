import { useState, useEffect } from "react";
import io from "socket.io-client";
import Layout from "../components/layout";
import Head from "next/head";
export default function Mine() {
  const [socket, setSocket] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [currentDifficulty, setCurrentDifficulty] = useState(0);
  const [hashAttempt, setHashAttempt] = useState("");
  const [successfulMine, setSuccessfulMine] = useState(false);
  const [miningOutput, setMiningOutput] = useState([]);
  const [isMining, setIsMining] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [walletBalance, setWalletBalance] = useState(0);

  useEffect(() => {
    setSocket(io("http://localhost:3042/"));
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("connect", () => {
      setSocketConnected(socket.connected);
      subscribeToMiningEvent();
    });
    socket.on("disconnect", () => {
      setSocketConnected(socket.connected);
    });

    socket.on("getMiningEvent", (miningEvent) => {
      setMiningOutput(miningEvent);
    });
  }, [socket]);

  const subscribeToMiningEvent = (interval = 1000) => {
    socket.emit("subscribeToMiningEvents", interval);
  };

  const startMining = async () => {
    if (!isMining && walletAddress.length) {
      // socket.emit("startMining");
      const response = await fetch("http://localhost:3000/api/mine", {
        method: "POST",
        headers: {
          "Content-Type": "applcation/json",
        },
        body: JSON.stringify({
          walletAddress: walletAddress,
          ACTION_TYPE: "startMining",
        }),
      });
      setIsMining(true);
    } else {
      // socket.emit("stopMining");
      const response = await fetch("http://localhost:3000/api/mine", {
        method: "POST",
        headers: {
          "Content-Type": "applcation/json",
        },
        body: JSON.stringify({
          walletAddress: walletAddress,
          ACTION_TYPE: "stopMining",
        }),
      });
      setIsMining(false);
    }
  };

  useEffect(() => {
    if (!walletAddress.length) return;
    const recoverWallet = async (value) => {
      try {
        const res = await fetch("http://localhost:3000/api/wallet", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ACTION_TYPE: "GET_BALANCE",
            publicKey: value,
          }),
        });
        let wallet = await res.json();
        console.log("wallet1", wallet);
        if (wallet) {
          setWalletBalance(wallet);
        }
      } catch (error) {
        console.error("error!", error);
      }
    };
    recoverWallet(walletAddress);
  }, [walletAddress, miningOutput]);

  const handleChange = (input) => (event) => {
    const value = event.target.value;
    switch (input) {
      case "walletAddress":
        setWalletAddress(value);
      default:
        break;
    }
  };
  return (
    <Layout>
      <Head>
        <title>1Ethereum - Mine</title>
      </Head>
      <div className="container-fluid">
        <h1>Mine</h1>
        <p className="lead">Wallet Balance: {walletBalance || 0} ETH</p>
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text">Wallet</span>
          </div>
          <input
            type="text"
            className="form-control"
            id="walletAddress"
            aria-label="walletAddress"
            placeholder="Miner's Address"
            onChange={handleChange("walletAddress")}
            value={walletAddress}
          />
        </div>
        <p>
          <button
            className="btn btn-lg btn-secondary my-3"
            onClick={startMining}
          >
            {isMining ? "Stop" : "Start"} mining
          </button>
        </p>
      </div>
      <div className="container-fluid">
        <table className="table table-dark">
          <thead>
            <tr>
              <th scope="col">Block #</th>
              <th scope="col">Hash</th>
              <th scope="col">Nonce</th>
            </tr>
          </thead>
          <tbody>
            {walletAddress
              ? miningOutput
                  .filter((mO) => mO.walletAddress == walletAddress)
                  .map((output) => {
                    return (
                      <tr key={output.blockNumber}>
                        <td>{output.blockNumber}</td>
                        <td>{output.hash}</td>
                        <td>{output.nonce}</td>
                      </tr>
                    );
                  })
              : miningOutput.map((output) => {
                  return (
                    <tr key={output.blockNumber}>
                      <td>{output.blockNumber}</td>
                      <td>{output.hash}</td>
                      <td>{output.nonce}</td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
