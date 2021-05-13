const jayson = require("jayson");
const { PORT } = require("./config");
const { startMining, stopMining } = require("./mine");
const { utxos } = require("./db");

const server = jayson.server({
  startMining: function (_, callback) {
    callback(null, "Started Mining!");
    startMining();
  },
  stopMining: function (_, callback) {
    callback(null, "Stopped Mining!");
    stopMining();
  },
  getBalance: function ([address], callback) {
    const ourUTXOs = utxos.filter((x) => {
      return x.owner === address && !x.spent;
    });
    const sum = ourUTXOs.reduce((p, c) => p + c.amount, 0);
    callback(null, `Balance for ${address}: ${sum}`);
  },
});

server.http().listen(PORT);
