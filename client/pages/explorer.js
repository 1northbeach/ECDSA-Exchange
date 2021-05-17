import Layout from "../components/layout";
import { useEffect, useState } from "react";
import { utils } from "ethers";
import Link from "next/Link";
import Head from "next/head";
export default function Explorer() {
  const [blockData, setBlockData] = useState(null);

  function timeConverter(UNIX_timestamp) {
    var time = new Date(UNIX_timestamp * 1000)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    return time;
  }

  useEffect(async () => {
    const getData = async () => {
      const data = await fetch("/api/explorer/");
      const blockData = await data.json();
      let blockDataArr = [];
      for (let index = 0; index < blockData.length; index++) {
        const block = blockData[index];
        blockDataArr.push(
          <tr key={block.number}>
            <td>{block.number}</td>
            <td>{timeConverter(block.timestamp)}</td>
            <td>{block.transactions.length}</td>
            <td>
              <Link href={`/address/${block.miner}`}>{block.miner}</Link>
            </td>
            <td>{parseInt(utils.formatUnits(block.gasUsed, "wei"))}</td>
            <td>{parseInt(utils.formatUnits(block.gasLimit, "wei"))}</td>
          </tr>
        );
      }
      return blockDataArr;
    };
    let blocks = await getData();
    setBlockData(blocks);
  }, []);

  return (
    <Layout>
      <Head>
        <title>1Ethereum - Explorer</title>
      </Head>
      <div className="container">
        <h1>Explorer</h1>
        <table className="table table-dark">
          <thead>
            <tr>
              <th scope="col" className="w-10">
                Block
              </th>
              <th scope="col" className="w-20">
                Age
              </th>
              <th scope="col" className="w-10">
                Txn
              </th>
              <th scope="col" className="w-40">
                Miner
              </th>
              <th scope="col" className="w-10">
                Gas Used
              </th>
              <th scope="col" className="w-10">
                Gas Limit
              </th>
            </tr>
          </thead>
          <tbody>{blockData || <td colSpan="6">Loading</td>}</tbody>
        </table>
      </div>
    </Layout>
  );
}
