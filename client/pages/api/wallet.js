// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
export default async function handler(req, res) {
  // console.log("=".repeat(100));
  // console.log("req.method", req.method);
  let wallet = null;
  let data = null;
  if (req.method === "POST") {
    switch (req.body.ACTION_TYPE) {
      case "CREATE":
        data = await fetch("http://localhost:3042/wallets/create", {
          method: "POST",
        });
        wallet = await data.json();
        if (wallet) {
          console.log("POST /api/wallet, new wallet created", wallet);
          res.status(200).json(wallet);
        }
        break;
      case "RECOVER":
        data = await fetch("http://localhost:3042/wallets/recover", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ privateKey: req.body.privateKey }),
        });
        wallet = await data.json();
        if (wallet.length) {
          console.log("POST /api/wallet, wallet recovered", wallet);
          res.status(200).json(wallet);
        } else {
          console.log("POST /api/wallet, wallet not found");
          res.status(404).json();
        }
        break;
      case "GET_BALANCE":
        data = await fetch("http://localhost:3042/wallets/getBalance", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ walletAddress: req.body.publicKey }),
        });
        let balance = await data.json();
        // console.log(balance.balance);
        if (balance.balance) {
          // console.log("POST /api/wallet, balance retrieved", balance.balance);
          res.status(200).json(balance.balance);
        } else {
          // console.log("POST /api/wallet, balance not found");
          res.status(404).json();
        }
        break;
      default:
        break;
    }
  }
}
