import { useRouter } from "next/router";
import Head from "next/head";
import Layout from "../../components/layout";
export default function Wallet() {
  const router = useRouter();
  const { address } = router.query;

  return (
    <Layout>
      <Head>
        <title>1Ethereum - {address}</title>
      </Head>
      <div className="container">
        <p className="lead">Wallet address: {address}</p>
      </div>
    </Layout>
  );
}
