/* eslint-disable no-undef */
var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "aim consider north pig logic siren sugar gas term try alcohol flower";
var infura = "rinkeby.infura.io/v3/3800efec09524d28840ea8aa6c7ab203";

module.exports = {
  
  networks: {

      development: {
        host: "127.0.0.1",
        port: 7545,
        network_id: "5777", // Match any network id
        from: "0xee379de94B26a8843d3502Bf2854d6F1eaE1ed8E",
      },

      rinkeby: {
        provider: () => new HDWalletProvider(mnemonic, infura),
        network_id: 4,
        gas: 6700000,
        gasPrice : 10000000000
      }
  },

  compilers: {
    solc: {
      version: "^0.5.6"
    }
  }
}