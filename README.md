# FlightSurety

FlightSurety is an Airline & Insurance Management DApp.

## Install

This repository contains Smart Contract code in Solidity (using Truffle), tests (also using Truffle), dApp scaffolding (using HTML, CSS and JS) and server app scaffolding.

To install, download or clone the repo, then:

`npm install`
`truffle compile`

## Develop Client

To run truffle tests:

`truffle test ./test/flightSurety.js`
`truffle test ./test/oracles.js`

To use the dapp:

`truffle migrate`
`npm run dapp`

To view dapp:

`http://localhost:8000`

## Develop Server
Edit airlineAddress in `2_deploy_contract.js`

`npm run server`

## Project Tests

Change the addresses array in /config/TestConfig.js to the addresses available on your Ganache Platforms

`truffle test ./test/oracles.js`
`truffle test ./test/flightSurety.js

- FlightSuretyTest
![FlightSurety Tests](https://i.imgur.com/Mgrau5A.png)

- Oracles Test

![FlightSurety Tests](https://i.imgur.com/fVLT8PH.png)


## Deploy

To build dapp for prod:
`npm run dapp:prod`

Deploy the contents of the ./dapp folder

## DApp Screenshot

![FlightSurety DApp](https://i.imgur.com/a7JHfSl.png)


## Resources

* [How does Ethereum work anyway?](https://medium.com/@preethikasireddy/how-does-ethereum-work-anyway-22d1df506369)
* [BIP39 Mnemonic Generator](https://iancoleman.io/bip39/)
* [Truffle Framework](http://truffleframework.com/)
* [Ganache Local Blockchain](http://truffleframework.com/ganache/)
* [Remix Solidity IDE](https://remix.ethereum.org/)
* [Solidity Language Reference](http://solidity.readthedocs.io/en/v0.4.24/)
* [Ethereum Blockchain Explorer](https://etherscan.io/)
* [Web3Js Reference](https://github.com/ethereum/wiki/wiki/JavaScript-API)
