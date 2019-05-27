/* eslint-disable no-undef */
const FlightSuretyApp = artifacts.require("FlightSuretyApp");
const FlightSuretyData = artifacts.require("FlightSuretyData");

module.exports = function(deployer) {

    let firstAirline = '0x301b434ee40DBe964Aa5580603fEe5dde22a12C6';
    
    deployer.deploy(FlightSuretyData, firstAirline)
    .then(() => {
        return deployer.deploy(FlightSuretyApp, FlightSuretyData.address)
                .then(() => {
                    let config = {
                        localhost: {
                            url: 'rinkeby.infura.io/v3/3800efec09524d28840ea8aa6c7ab203',
                            dataAddress: FlightSuretyData.address,
                            appAddress: FlightSuretyApp.address,
                            numOracles: 50,
                        }
                    }
                    fs.writeFileSync(__dirname + '/../src/server/config.json',JSON.stringify(config, null, '\t'), 'utf-8');
                }); 
    });
}