import Layout from "../components/layout";
import Link from "next/link";

export default function Home() {
  return (
    <Layout>
      <h1 className="cover-heading">Start HODLing today.</h1>
      <p className="lead">
        Get set up to join the movement or use your existing wallet to send and
        receive magic internet money.
      </p>
      <p className="lead">
        <Link href="/wallet">
          <a className="btn btn-lg btn-secondary mx-2 my-2">Wallet</a>
        </Link>
        <Link href="/send">
          <a className="btn btn-lg btn-secondary mx-2 my-2">Send</a>
        </Link>
      </p>
    </Layout>
  );
}
