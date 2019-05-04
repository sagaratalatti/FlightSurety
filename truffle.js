var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "effort category slender foil siren alter victory smooth spin charge cat warrior";

module.exports = {
  networks: {
    development: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "http://127.0.0.1:7545/", 0, 50);
      },
      host: 'http://127.0.0.1:7545',
      network_id: '5777'
    }
  },
  compilers: {
    solc: {
      version: "^0.5.6"
    }
  }
};