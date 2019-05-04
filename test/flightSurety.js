
var Test = require('../config/testConfig.js');

contract('Flight Surety Tests', async (accounts) => {

  var config;
  before('setup contract', async () => {
    config = await Test.Config(accounts);
    await config.flightSuretyData.authorizeCaller(config.flightSuretyApp.address);
  });

  /****************************************************************************************/
  /* Operations and Settings                                                              */
  /****************************************************************************************/

  it(`(multiparty) has correct initial isOperational() value`, async function () {

    let status = await config.flightSuretyData.isOperational.call();
    assert.equal(status, true, "Incorrect initial operating status value");

  });

  it(`(multiparty) can block access to setOperatingStatus() for non-Contract Owner account`, async function () {

      let accessDenied = false;
      try {
          await config.flightSuretyData.setOperatingStatus(false, { from: config.testAddresses[2] });
      } catch(e) {
          accessDenied = true;
      }
      assert.equal(accessDenied, true, "Access not restricted to Contract Owner");
            
  });

  it(`(multiparty) can allow access to setOperatingStatus() for Contract Owner account`, async function () {

      let accessDenied = false;
      try {
          await config.flightSuretyData.setOperatingStatus(false);
      } catch(e) {
          accessDenied = true;
      }
      assert.equal(accessDenied, false, "Access not restricted to Contract Owner");
      
  });

  it(`(multiparty) can block access to functions using requireIsOperational when operating status is false`, async function () {

      await config.flightSuretyData.setOperatingStatus(false);

      let reverted = false;
      try {
          await config.flightSurety.setTestingMode(true);
      } catch(e) {
          reverted = true;
      }
      assert.equal(reverted, true, "Access not blocked for requireIsOperational");      

      await config.flightSuretyData.setOperatingStatus(true);

  });

  it('(airline) cannot register an Airline using registerAirline() if it is not funded', async () => {
    
    let newAirline = accounts[2];

    try {
        await config.flightSuretyApp.registerAirline(newAirline, {from: config.firstAirline});
    }
    catch(e) {

    }
    let result = await config.flightSuretyData.hasAirlineRegistered.call(newAirline); 

    assert.equal(result, false, "Airline should not be able to register another airline if it hasn't provided funding");

  });

  it('(registered airline) can deposit fund', async () => {
    
    let funding_value = await config.flightSuretyApp.AIRLINE_FUNDING_VALUE.call();
    
    try {
        await config.flightSuretyApp.fundAirline(
            {from: config.firstAirline,
                value: funding_value.toString()});
    }
    catch(e) {
    }
    let result = await config.flightSuretyData.hasAirlineFunded(config.firstAirline);

    assert.equal(result, true, "Airline hasn't yet provided funding");
});

it('(funded airline) can register an Airline using registerAirline() if number of funded airlines is below treshold', async () => {

    let newAirline = config.testAddresses[2];

    try {
        await config.flightSuretyApp.registerAirline(newAirline, {from: config.firstAirline});
    } catch(e) {}
    
    let result = await config.flightSuretyData.hasAirlineRegistered(newAirline);

    assert.equal(result, true, "Airline should not be able to register another airline if it hasn't provided funding");

});

it('(4 airlines) can be registered before theshold kicks in', async () => {

    let airline3 = config.testAddresses[3];
    let airline4 = config.testAddresses[4];

    try {
        await config.flightSuretyApp.registerAirline(airline3, {from: config.firstAirline});
    } catch(e) {
    }
    let result3 = await config.flightSuretyData.hasAirlineRegistered(airline3);
    
    assert.equal(result3, true, "Third airline should be able to be registered");

    
    try {
        await config.flightSuretyApp.registerAirline(airline4, {from: config.firstAirline});
    }
    catch(e) {
    }
    let result4 = await config.flightSuretyData.hasAirlineRegistered(airline4);
    
    assert.equal(result4, true, "Fourth airline should be able to be registered");
});


it('(5th airline) cannot be registered without multiparty consensus', async () => {

    let result = undefined;
    let airline5 = config.testAddresses[5];

    try {
        await config.flightSuretyApp.registerAirline(airline5, {from: config.firstAirline});
    } catch(e) {
    }
    result = await config.flightSuretyData.hasAirlineRegistered(airline5);;
    
    assert.equal(result, false, "Fifth airline should not be able to be registered without passing the treshold");
});


it('(airline) cannot register another airline that is already registered', async () => {

    let result = undefined;
    let newAirline = config.testAddresses[2];

    try {
        result = await config.flightSuretyApp.registerAirline(newAirline);
    } catch(e) {
        result = false;
    }
    
    assert.equal(result, false, "Airline should not be able to register an already registered airline");
});


it('(airline) can be register using the multiparty consensus', async () => {

    
    let funding_value = await config.flightSuretyApp.AIRLINE_FUNDING_VALUE.call();
    let newAirline = config.testAddresses[2];
    let airline3 = config.testAddresses[3];
    let airline4 = config.testAddresses[4];
    let airline5 = config.testAddresses[5];
    
        try {
            await config.flightSuretyApp.fundAirline({from: newAirline, value: funding_value.toString()});
            await config.flightSuretyApp.fundAirline({from: airline3, value: funding_value.toString()});
            await config.flightSuretyApp.fundAirline({from: airline4, value: funding_value.toString()});
        } catch(e) {
        }

        try {
            await config.flightSuretyApp.registerAirline(airline5, {from: newAirline});
        } catch(e) {
        }
    let resDuplicate = undefined;
        try {
            resDuplicate = await config.flightSuretyApp.registerAirline(airline5, {from: newAirline});
        } catch(e) {
            resDuplicate = false;
        }

    assert.equal(resDuplicate, false, "A registered airline should not be able to register twice the same airline.");

        try {
            await config.flightSuretyApp.registerAirline(airline5, {from: airline3});
        }  catch (e) {
        }
        let result = await config.flightSuretyData.hasAirlineRegistered(airline5);

        assert.equal(result, true, "Fifth airline should now be registered using multiparty consensus.");
    });

});
