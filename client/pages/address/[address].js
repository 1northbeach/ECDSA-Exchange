import { useRouter } from "next/router";
import { utils } from "ethers";
import { useEffect, useState } from "react";
import Head from "next/head";
import Layout from "../../components/layout";
export default function Address() {
  const [balance, setBalance] = useState(0);
  const router = useRouter();
  const { address } = router.query;

  useEffect(async () => {
    const getData = async () => {
      const data = await fetch("/api/address/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address: address }),
      });
      const { balance } = await data.json();
      let balanceEth = parseInt(utils.formatUnits(balance, "ether"));

      return balanceEth;
    };
    let balance = await getData();
    setBalance(balance);
  }, []);

  return (
    <Layout>
      <Head>
        <title>1Ethereum - {address}</title>
      </Head>
      <div className="container">
        <p className="lead">Wallet address: {address}</p>
        <p className="lead">Balance: {balance || 0} ETH</p>
      </div>
    </Layout>
  );
}
