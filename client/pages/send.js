import { useEffect, useState } from "react";
import Layout from "../components/layout";
import Head from "next/head";

export default function Send() {
  const [sendersPrivateKey, setSendersPrivateKey] = useState(null);
  const [recipientAddress, setRecipientAddress] = useState(null);
  const [amountToSend, setAmountToSend] = useState(null);
  const [senderAddress, setSenderAddress] = useState(null);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [transactionStatus, setTransactionStatus] = useState(null);
  const [transactionSent, setTransactionSent] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("submit clicked");
    console.log("receipientAddress", recipientAddress);
    console.log("sendersPrivateKey", sendersPrivateKey);
    console.log("senderAddress", senderAddress);
    console.log("amountToSend", amountToSend);
    if (amountToSend > availableBalance) {
      setTransactionStatus("Not enough balance!");
      return;
    }
    try {
      const res = await fetch("http://localhost:3000/api/send", {
        method: "POST",
        body: JSON.stringify({
          sendersPrivateKey: sendersPrivateKey,
          senderAddress: senderAddress,
          recipientAddress: recipientAddress,
          amountToSend: amountToSend,
        }),
      });
      const data = await res.json();
      setAvailableBalance(data.balance);
      setTransactionSent(true);
      setTransactionStatus("Transaction sent!");
    } catch (error) {
      setTransactionStatus("Transaction failed!");
    }
  };
  const updateTxnStatus = (status) => {
    return transactionStatus ? status : "";
  };
  useEffect(async () => {
    updateTxnStatus(transactionStatus);
  }, [transactionStatus]);
  useEffect(async () => {
    const res = await fetch("http://localhost:3000/api/wallet");
    const data = await res.json();
    setSenderAddress(data.address);
    setAvailableBalance(data.balance);
  }, [transactionStatus]);
  const handleChange = (input) => (event) => {
    const value = event.target.value;
    switch (input) {
      case "sendersPrivateKey":
        setSendersPrivateKey(value);
        break;
      case "recipientAddress":
        setRecipientAddress(value);
        break;
      case "amountToSend":
        setAmountToSend(value);
        break;
      default:
        break;
    }
  };
  return (
    <Layout>
      <Head>
        <title>1Ethereum - Send</title>
      </Head>
      <h1>Send</h1>
      {transactionSent || updateTxnStatus(transactionStatus)}
      <p>Available to send: {availableBalance} ETH</p>
      <form>
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text">PVT</span>
          </div>
          <input
            type="text"
            className="form-control"
            id="sendersPrivateKey"
            aria-label="sendersPrivateKey"
            placeholder="Sender's Private Key"
            onChange={handleChange("sendersPrivateKey")}
            value={sendersPrivateKey}
          />
        </div>
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text">To</span>
          </div>
          <input
            type="text"
            className="form-control"
            id="recipientAddress"
            aria-label="recipientAddress"
            placeholder="Recipient's Address"
            onChange={handleChange("recipientAddress")}
            value={recipientAddress}
          />
        </div>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            id="amountToSend"
            aria-label="amountToSend"
            placeholder="100"
            onChange={handleChange("amountToSend")}
            value={amountToSend}
          />
          <div className="input-group-append">
            <span className="input-group-text">ETH</span>
          </div>
        </div>
        <button
          className="btn btn-lg btn-secondary my-3"
          onClick={handleSubmit}
        >
          Send
        </button>
      </form>
    </Layout>
  );
}
