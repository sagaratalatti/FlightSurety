import 'babel-polyfill';
import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import FlightSuretyData from '../../build/contracts/FlightSuretyData.json';
import contract from 'truffle-contract';
import truffleAssert from 'truffle-assertions';
import Web3 from 'web3';
import express from 'express';
const bodyParser = require("body-parser");
const cors = require("cors");


let web3 = new Web3(new Web3.providers.WebsocketProvider('ws://127.0.0.1:7545'));
const accounts = web3.eth.getAccounts();
web3.eth.defaultAccount = "0x55690752ed06B1d37510D20B3516b2D12F007f6d";
let flightSuretyApp = contract(FlightSuretyApp);
let flightSuretyData = contract(FlightSuretyData);

class ContractServer {

  constructor() {
    this.flightsForPurchase = [];
    this.flightsLanded = [];
    this.oracles = [];
    this.status = [10, 20, 30, 40, 50, 0];
  }

  init = async () => {

    flightSuretyApp.setProvider(web3.currentProvider);
    flightSuretyData.setProvider(web3.currentProvider);



    try {
      const flightApp = await flightSuretyApp.deployed();
      const flightData = await flightSuretyData.deployed();
      const address = flightApp.address;
      const accs = await accounts;
      await flightData.authorizeCaller(address, {from: accs[0]});
      console.log(accs[0])
    } catch (error) {
      console.log(error.toString());
      console.error('Check if Ganache is running and contracts deployed properly!');
      process.exit();
    }

    this.registerOracles();
    this.getRegisteredFlights();
    this.watchEvents();
  }

  registerOracles = async () => {
    const flightApp = await flightSuretyApp.deployed();
    let self = this;
    const fee = await flightApp.REGISTRATION_FEE();
    const accs = await accounts;

    const numOracles = 50 < accs.length ? 50 : (accs.length - 1)

    for (var i = 1; i < numOracles; i++) {
      try {
        self.oracles.push(accs[i]);
        await flightApp.registerOracle({
          from: accs[i], value: fee, gas: 3000000
      });

      } catch (error) {
        console.log(error.toString());
      }  
    }
  }

  submitOracleResponse = async(airline, flight, timestamp) => {
    const flightApp = await flightSuretyApp.deployed();

    for (let i = 0; i < this.oracles.length; i++) {
      const statusCode = this.status[Math.floor(Math.random() * this.status.length)];
      console.log('random statusCode: ' + statusCode);
      try {
        let idxs = await flightApp.getMyIndexes({from: this.oracles[i]});

        for(let y = 0; y < idxs.length; y++) {
          try {
            await flightApp.submitOracleResponse(idxs[y], airline, flight, timestamp, statusCode, {from: this.oracles[i], gas: 3000000});
          } catch (error) {
            console.log(error.toString());
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  getRegisteredFlights = async () => {
    const flightData = await flightSuretyData.deployed();
    let self = this;
    const numRegisteredFlights = await flightData.getRegisteredFlights();
    console.log(numRegisteredFlights + ' registered flights');

    self.flightsForPurchase = [];
    self.flightsLanded = [];

    for (let i = 0; i < parseInt(numRegisteredFlights); i++) {
      try {
        let flightKey = await flightData.getFlightKeyIndex(i);
        let flight = await flightData.flights(flightKey);
        flight.flightKey = flightKey;
        console.log('Status Code from Contract: ' + flight.statusCode);
        if (flight.statusCode != 0) {
          console.log('Flights for Landed: ');
          self.flightsLanded.push(flight);
        } else {
          console.log('Flights Purchase: ');
          self.flightsForPurchase.push(flight);
        }
      } catch (error) {
        console.log(e);
      }
    }
  }

  watchEvents = async() =>{
    const flightApp = await flightSuretyApp.deployed();
    let oracleReportEvent = await flightApp.OracleReport();
        oracleReportEvent.on("data", function(data) {
          submitOracleResponse(data.args.airline, data.args.flight, data.args.timestamp);
        })
  }
}

class FlightSuretyServer {

  constructor(contractServer) {
    this.app = express();
    this.contractServer = contractServer;
    this.initExpressMiddleWare();
    this.getInformation();
    this.getFlights();
  }

  initExpressMiddleWare() {
    this.app.use(bodyParser.urlencoded({extended: true}));
    this.app.use(bodyParser.json());
    this.app.use(cors());
  }

  getFlights() {
    this.app.get("/flights", async (req, res) => {
      await this.contractServer.getRegisteredFlights();

      res.json({
        flightsForPurchase: this.contractServer.flightsForPurchase,
        flightsLanded: this.contractServer.flightsLanded
      });
    });
  }

  getInformation() {
    this.app.get("/", (req, res) => {
      res.json({
        endpoints: [
          {
            "/" : {
              method: "GET",
              description: `An API for use with your Dapp`
            },

            "/flights": {
              method: "GET",
              description: `List of flights`
            }
          }
        ]
      });
    });
  }
}

const contractServer = new ContractServer();
contractServer.init();
const app = new FlightSuretyServer(contractServer);
export default app;


