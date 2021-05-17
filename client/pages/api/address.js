import provider from "../../lib/provider";

export default async function handler(req, res) {
  console.log("POST /api/address");
  console.log(req.body);

  const { address } = req.body;
  console.log(address);

  let response = {};
  response.balance = await provider.getBalance(address);
  console.log(response);

  res.status(200).json(response);
}
