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
Edit airline in `2_deploy_contract.js`
`npm run server`
`truffle test ./test/oracles.js`
`truffle test ./test/flightSurety.js

## Deploy

To build dapp for prod:
`npm run dapp:prod`

Deploy the contents of the ./dapp folder

## DApp Screenshot

![FlightSurety DApp](https://i.imgur.com/a7JHfSl.png)

# Contract Deployed to Rinkeby Testnet

| Contract             | Address on Rinkeby test network                                    | 
|----------------------|--------------------------------------------------------------------|
| FlightSuretyData     | 0x0600B30dC5dCdB58CD8C47976c5b19409eDD88BA                         |
| FlightSuretyApp      | 0x04a382CF4b9EA08610413b2bA608ed11312DafBc                         |


## Resources

* [How does Ethereum work anyway?](https://medium.com/@preethikasireddy/how-does-ethereum-work-anyway-22d1df506369)
* [BIP39 Mnemonic Generator](https://iancoleman.io/bip39/)
* [Truffle Framework](http://truffleframework.com/)
* [Ganache Local Blockchain](http://truffleframework.com/ganache/)
* [Remix Solidity IDE](https://remix.ethereum.org/)
* [Solidity Language Reference](http://solidity.readthedocs.io/en/v0.4.24/)
* [Ethereum Blockchain Explorer](https://etherscan.io/)
* [Web3Js Reference](https://github.com/ethereum/wiki/wiki/JavaScript-API)
