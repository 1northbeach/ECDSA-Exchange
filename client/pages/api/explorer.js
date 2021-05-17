import { providers } from "ethers";

export default async function handler(req, res) {
  console.log("GET /api/explorer");

  var provider = new providers.InfuraProvider();
  const latestBlock = await provider.getBlockNumber();
  console.log(latestBlock);
  let last10Blocks = [];
  for (let i = 0; i < 10; i++) {
    let block = await provider.getBlock(latestBlock - i);
    last10Blocks.push(block);
  }

  res.status(200).json(last10Blocks);
}
