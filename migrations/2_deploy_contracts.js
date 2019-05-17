/* eslint-disable no-undef */
const FlightSuretyApp = artifacts.require("../contracts/FlightSuretyApp.sol");
const FlightSuretyData = artifacts.require("../contracts/FlightSuretyData.sol");
const fs = require('fs');

module.exports = function(deployer) {

    let firstAirline = '0x55690752ed06B1d37510D20B3516b2D12F007f6d';
    
    deployer.deploy(FlightSuretyData, firstAirline)
    .then(() => {
        return deployer.deploy(FlightSuretyApp, FlightSuretyData.address)
                .then(() => {
                    let config = {
                        localhost: {
                            url: 'http://127.0.0.1:7545',
                            dataAddress: FlightSuretyData.address,
                            appAddress: FlightSuretyApp.address,
                            numOracles: 50,
                        }
                    }
                    fs.writeFileSync(__dirname + '/../src/dapp/config.json',JSON.stringify(config, null, '\t'), 'utf-8');
                    fs.writeFileSync(__dirname + '/../src/server/config.json',JSON.stringify(config, null, '\t'), 'utf-8');
                });
    });
}