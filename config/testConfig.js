/* eslint-disable no-undef */

var FlightSuretyApp = artifacts.require("FlightSuretyApp");
var FlightSuretyData = artifacts.require("FlightSuretyData");
var BigNumber = require('bignumber.js');

var Config = async function(accounts) {
    
    // These test addresses are useful when you need to add
    // multiple users in test scripts
    let testAddresses = [
        "0xee379de94B26a8843d3502Bf2854d6F1eaE1ed8E",
        "0xd147E40f41191DADDb4663ed65b08C005B4f472b",
        "0x8cE4703d19F1cE42529a4eC072CC9711500f9C6B",
        "0x99135C1BE8e67321b01841303aB370418d6641B3",
        "0xA64ebda558bb4F1e3E231374E6af34Cc987BC128",
        "0x9fFc86819e1553D48D15adF4a4542AcF95D78e49",
        "0x0ADAB98916C992041dCF04D56ac481c3b1B11C92",
        "0x4c2249715260090B27C86cC40048a617A54CC37F",
        "0x9FF8E118654db571556cc20c005BE155e16441ED",
        "0xB6FFe7CfdB386FFde17f245d4f13f850834D0045",
        "0xE96354cAe556F2cB99EE6DBbbbd572cC12b99261",
        "0xa8c760d74cD12d1D0353E3c7a9f0e94D51C7D728",
        "0xED0F401A1b433b8E81cDe4517c311Bc5367681E3",
        "0x15901Cc92aE8B2223C4A4e4Bf08BcE1c0e07a2BE",
        "0x84BdeeA5740B5D0baC0E4Ae1450ec9BF962B3d63",
        "0xAa3936a35927391675C8085C6cd89f2930711eE3", 
        "0xb15f43db551A52Ab2A62aC9569Be28a7915Ead26",
        "0x0a9A80d59AF706C578e32aD57D863cAeB2AE22e0",
        "0xbD59eFfb39DD07232fb613eb127102ef3a1f380d",
        "0x95069e3ba10f46661E704f136ae8C0Cf3454D4c5",
        "0x095C62631e152C043073A72060C9ea8511faD737",
        "0x048f86B26E5756162D714184CCA9716A553bf95F",
        "0x04e50e9A6Ed4E10477f1F64228Ea79E2CfcD2763",
        "0x868c52Fb660c1dbCe95F8fac5D84467C71375DD6",
        "0xd85462731b398D5eD5567CA3a407a734e79971dc",
        "0xd4253fF155eB9642b4E16E1D8D6ecFec4239274A",
        "0x597756600153b04FEBa361EA9ce05DFb5D8f7767",
        "0xe2D933b52B265a1a064b1CB060A1500fFb1365dA",
        "0xb0Ea73b5aFA911EF3166A605D2C796404c8A4BBD",
        "0x27bdF21E77EAd5a799011B05F19472811a22AEfa"
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