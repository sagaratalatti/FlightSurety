var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "effort category slender foil siren alter victory smooth spin charge cat warrior";
var infura = "/";

module.exports = {
  networks: {

      development: {
        host: "127.0.0.1",
        port: 7545,
        network_id: "5777" // Match any network id
      },

      rinkeby: {
        provider: () => new HDWalletProvider(mnemonic, infura),
        network_id: 4,
        gas: 6700000,
        gasPrice : 10000000000
      },
  },

  compilers: {
    solc: {
      version: "^0.5.6"
    }
  }
}