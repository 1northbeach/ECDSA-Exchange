import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { utils } from "ethers";
import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/layout";

export default function Block() {
  const [blockData, setBlockData] = useState(null);

  const router = useRouter();
  const { block } = router.query;

  function timeConverter(UNIX_timestamp) {
    var time = new Date(UNIX_timestamp * 1000)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    return time;
  }

  useEffect(async () => {
    const getData = async () => {
      const data = await fetch("/api/block/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          blockNumber: block,
        }),
      });
      const blockData = await data.json();
      return (
        <tbody>
          <tr>
            <td>Block Height:</td>
            <td>{blockData.number}</td>
          </tr>
          <tr>
            <td>Timestamp:</td>
            <td>{timeConverter(blockData.timestamp)}</td>
          </tr>
          <tr>
            <td>Transactions:</td>
            <td>{blockData.transactions.length}</td>
          </tr>
          <tr>
            <td>Mined By:</td>
            <td>
              <Link href={`/address/${blockData.miner}`}>
                <a>{blockData.miner}</a>
              </Link>
            </td>
          </tr>
          <tr>
            <td>Difficulty:</td>
            <td>{blockData.difficulty}</td>
          </tr>
          {/* <tr>
            <td>Size:</td>
            <td></td>
          </tr> */}
          <tr>
            <td>Gas Used:</td>
            <td>{parseInt(utils.formatUnits(blockData.gasUsed, "wei"))}</td>
          </tr>
          <tr>
            <td>Gas Limit:</td>
            <td>{parseInt(utils.formatUnits(blockData.gasLimit, "wei"))}</td>
          </tr>
          <tr>
            <td>Extra Data:</td>
            <td>{blockData.extraData}</td>
          </tr>
        </tbody>
      );
    };
    let block = await getData();
    setBlockData(block);
  }, []);

  return (
    <Layout>
      <Head>
        <title>1Ethereum - Block #{block}</title>
      </Head>
      <div className="container">
        <p className="lead">Block #{block}</p>
      </div>
      <h2>Overview</h2>
      <table className="table table-dark">{blockData || "Loading"}</table>
    </Layout>
  );
}
