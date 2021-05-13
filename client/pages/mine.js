import { useState, useEffect } from "react";

import Layout from "../components/layout";
import Head from "next/head";
export default function Mine() {
  const [currentDifficulty, setCurrentDifficulty] = useState(0);
  const [hashAttempt, setHashAttempt] = useState("");
  const [successfulMine, setSuccessfulMine] = useState(false);

  // useEffect(async () => {
  //   const res = await fetch("http://localhost:3000/api/wallet");
  //   const data = await res.json();
  //   setSenderAddress(data.address);
  //   setAvailableBalance(data.balance);
  // }, [transactionStatus]);
  const miningOutput = () => {
    return (
      <tr>
        <td>1</td>
        <td>Mining output Example</td>
      </tr>
    );
  };
  const handleSubmit = async () => {
    const res = await fetch("http://localhost:3000/api/miner");
    const data = await res.json();
    setHashAttempt(data.hash);
    let hashDiff = 0;
    for (let index = 0; index < hashAttempt.length; index++) {
      const element = hashAttempt[index];
      if (element != "0") {
        index = 1000000000;
        return;
      } else {
        ++hashDiff;
      }
    }
    if (hashDiff > currentDifficulty) {
      setSuccessfulMine(true);
    }
    setAvailableBalance(data.balance);
    return;
  };
  return (
    <Layout>
      <Head>
        <title>1Ethereum - Mine</title>
      </Head>
      <h1>Mine</h1>
      <div className="container">Current Difficulty: {currentDifficulty}</div>
      <div className="container">Last Hash attempt: {hashAttempt}</div>

      <button className="btn btn-lg btn-secondary my-3" onClick={handleSubmit}>
        Start mining
      </button>
      <div className="mining-output">
        <table>
          <thead>
            <th>
              <td>Log #</td>
              <td>Output</td>
            </th>
            <tbody>{miningOutput}</tbody>
          </thead>
        </table>
      </div>
    </Layout>
  );
}
