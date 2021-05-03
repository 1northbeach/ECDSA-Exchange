// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
let currentWallet = {};
export default async function handler(req, res) {
  console.log("=".repeat(100));
  console.log(req.method);
  let wallet = null;
  if (req.method === "POST") {
    switch (req.body.ACTION_TYPE) {
      case "CREATE":
        const data = await fetch("http://localhost:3042/wallets/create", {
          method: "POST",
        });
        wallet = await data.json();
        if (wallet) {
          console.log("POST /api/wallet, new wallet created", wallet);
          currentWallet = wallet;
          res.status(200).json(currentWallet);
        }
        break;
      case "RECOVER":
        wallet = await fetch("http://localhost:3042/wallets/recover", {
          method: "POST",
        });
        if (wallet) {
          console.log("POST /api/wallet, wallet recovered", wallet);
          currentWallet = wallet;
          res.status(200).json(currentWallet);
        }
      default:
        break;
    }
  } else {
    if (req.method === "GET") {
      console.log("GET /api/wallet", currentWallet);
      res.status(200).json(currentWallet);
    }
  }
}
