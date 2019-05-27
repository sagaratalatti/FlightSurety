/* eslint-disable no-undef */

var FlightSuretyApp = artifacts.require("FlightSuretyApp");
var FlightSuretyData = artifacts.require("FlightSuretyData");
var BigNumber = require('bignumber.js');

var Config = async function(accounts) {
    
    // These test addresses are useful when you need to add
    // multiple users in test scripts
    let testAddresses = [
        "0xFb490444CB4D91a95160faB7FfF6a264eA85da39",
        "0x78D844Fd4Ac0A9729cF3750f4D7C836d7c8BbA03",
        "0xc563F4DCD950d007D721122a01d868687c9C4D34",
        "0x8fc5c264f400004F554d95Ac7d00737927021c87",
        "0xE2140148465c8b6217469274B164F94705bDb7B6",
        "0x63575E3FB7E41eDE807443348b162408234ccA69",
        "0x5dB839F5D9ca0ED46691F78d6a234434d0e8A4e9",
        "0x764eB3B4443DC143DB8f289DA618069F1588257e",
        "0xf62aB456DF9D95af2b24114973Fc290EF5101F60",
        "0x6F97525D7771De78F3DE31b1673434d0fA2AAD44",
        "0x2d21751E6cb3B65F13fC26aDfA91d39E737640Cd",
        "0xC3730972023165813B96979AB3529C917ce2e32B",
        "0xe29c1c0590b8aD180756059A0e942D5843034932",
        "0x193CeeC6B4f798d379cb916Eb8199b60a0D20881",
        "0xE080f5078B53626962ECD5F3eFc5b23e42c4B375",
        "0xE3452d1fe7Ee7542660C7a6A607b8236F8D7399F", 
        "0xB5be543c73B9b942997Cf4D971ac03bB98E84B2F",
        "0x62dEe2F3222D6DB374Ad275811683288acBD617E",
        "0x98A6155fcacD4975BF9cCfa32eD4B07807e57837",
        "0x8353Ee772759a7775Ea0dBfA2c39DDef1FE8879d",
        "0xcf80e2532aa4fC237A5d3857dbe94DD80832A7e6",
        "0x842b4357a701C0330AED349Ca96a4bD94e7B78FB",
        "0x7636f4FFdC123DE1AF8cba159c7e2A5135219dA9",
        "0x3Dcf7edD9033420fa4549cf4192b4df965BfDa28",
        "0x18F044438A9Ad0F442F6218D55b0e1C997dE8AA8",
        "0x2a58a9B9a86EC98e53c170cbbb9acEf3C618d6f6",
        "0x0b5dBcBA1C3eB0480A8260af24fC018Be52c1373",
        "0x6e16D2c464dB7f1221c2ED7409F85B07d92B7213",
        "0x1120BF13Ed5A13CC7fAa15260D3C32C03a44bD59",
        "0xcDd75913797B3943d6FBf9B1C2992A48195D1096"
    ];


    let owner = accounts[0];
    let firstAirline = accounts[1];

    let flightSuretyData = await FlightSuretyData.new(firstAirline);
    let flightSuretyApp = await FlightSuretyApp.new(flightSuretyData.address);

    
    return {
        owner: owner,
        firstAirline: firstAirline,
        weiMultiple: (new BigNumber(10)).pow(18),
        testAddresses: testAddresses,
        flightSuretyData: flightSuretyData,
        flightSuretyApp: flightSuretyApp
    }
}

module.exports = {
    Config: Config
};