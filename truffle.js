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
        from: "0x55690752ed06B1d37510D20B3516b2D12F007f6d"
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