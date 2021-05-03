import Layout from "../components/layout";
import Head from "next/head";

export default function About() {
  return (
    <Layout>
      <Head>
        <title>1Ethereum - About</title>
      </Head>
      <h1 className="cover-heading">About.</h1>
      <p className="lead">
        Powered by <a href="https://nextjs.com">Next.js</a>, elliptic, crypto-js
        and express. Template from Bootstrap example by{" "}
        <a href="https://twitter.com/mdo">@mdo</a>.
      </p>
    </Layout>
  );
}
