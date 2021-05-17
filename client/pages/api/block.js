import provider from "../../lib/provider";

export default async function handler(req, res) {
  const { blockNumber } = req.body;
  console.log("GET /api/block/" + blockNumber);
  let block = await provider.getBlock(blockNumber);
  console.log(block);
  res.status(200).json(block);
}
