Submission for Week 2 Project in Chainshot Ethereum Developer Bootcamp by 1northbeach - Juan

#

### how to start server

```
$ npm i
$ npm run server
```

### how to start client

```
$ cd client
$ npm i
$ npm run dev
```

### summary

Proof of work connected to a next.js frontend with a backend powered by express, jayson and socket.io.

### basic workflow

1. create a few wallets
2. note the private key of one wallet from the server log or front end
3. grab the address either from the server log or the front end
4. go to /send and enter the appropriate inputs to start a transaction
5. go to /mine, enter your wallet and press the mine button until your miner successfully mines a block and receive some ETH in return. if you navigate to page, will display mining logs for all workers. enter your wallet address and filters logs to your miner's successful mining output. you can start and stop your miner upon entering wallet address.

### todo

1. some validation
2. ~~balance checking~~
3. wallet persistence
4. use of vrs signatures instead of sending private key
5. transaction history
6. receive page
7. testing would be nice and have helped a lot
8. move mining to client. server doing all the work currently.
9. anyone with your wallet can stop you from mining, maybe use private key to toggle mining.
10. balance is calculated by integer value associated with it. use UTXOs to calculate.
11. currently mines blocks sequentially but not tested for double spends/mining.
