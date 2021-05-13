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
  return (
    <Layout>
      <Head>
        <title>1Ethereum - Mine</title>
      </Head>
      <h1>Mine</h1>
      <p>
        <div className="container">Current Difficulty: {currentDifficulty}</div>
        <div className="container">Last Hash attempt: {hashAttempt}</div>
      </p>
      <p>
        <button className="btn btn-lg btn-secondary my-3" onClick={startMining}>
          Start mining
        </button>
      </p>

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
    </Layout>
  );
}
