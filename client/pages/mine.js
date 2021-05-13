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
    if (!isMining) {
      socket.emit("startMining");
      const response = await fetch("http://localhost:3000/api/mine");

      setIsMining(true);
    } else {
      socket.emit("stopMining");
      setIsMining(false);
    }
  };

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
      <div className="container">
        <h1>Mine</h1>

        <p>Current Difficulty: {currentDifficulty}</p>
        <p>Wallet Balance: {hashAttempt || 0} ETH</p>
        <p>
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
        </p>
        <p>
          <button
            className="btn btn-lg btn-secondary my-3"
            onClick={startMining}
          >
            Start mining
          </button>
        </p>
      </div>
      <div className="container-fluid">
        <p>
          <table className="table table-dark">
            <thead>
              <tr>
                <th scope="col">Block #</th>
                <th scope="col">Hash</th>
                <th scope="col">Nonce</th>
              </tr>
            </thead>
            <tbody>
              {miningOutput.map((output) => {
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
        </p>
      </div>
    </Layout>
  );
}
