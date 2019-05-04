import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import FlightSuretyData from '../../build/contracts/FlightSuretyData.json';
import Config from './config.json';
import Web3 from 'web3';
import express from 'express';
const bodyParser = require("body-parser");
const cors = require("cors");



let config = Config['localhost'];
let web3 = new Web3(new Web3.providers.WebsocketProvider(config.url.replace('http', 'ws')));
const accounts = web3.eth.getAccounts();
web3.eth.defaultAccount = "0x55690752ed06B1d37510D20B3516b2D12F007f6d";
let flightSuretyApp = new web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);
let flightSuretyData = new web3.eth.Contract(FlightSuretyData.abi, config.dataAddress);


class ContractServer {

  constructor() {
    this.flightsForPurchase = [];
    this.flightsLanded = [];
    this.oracles = [];
    this.status = [20, 30, 40, 50, 0];
  }

  init = async () => {

    try {
      const address = flightSuretyApp.address;
      const accs = await accounts;
      await flightSuretyData.methods.authorizeCaller(address).send({from: accs[0]});
    } catch(error) {
      console.log(error.toString());
      console.error('Check if Ganache is running and contracts deployed properly!');
      process.exit();
    }

    this.registerOracles();
    this.listenEvents();
    this.getRegisteredFlights();
  }

  registerOracles = async () => {
    let self = this;
    const fee = await flightSuretyApp.methods.REGISTRATION_FEE().call();
    const accs = await accounts;

    const numOracles = config.numOracles < accs.length ? config.numOracles : (accs.length - 1)

    for (var i = 1; i < numOracles; i++) {
      try {
        self.oracles.push(accs[i]);
        await flightSuretyApp.methods.registerOracle().send({
          from: accs[i], value: fee, gas: 3000000
      });

      } catch (error) {
        console.log(error.toString());
      }  
    }
  }

  submitOracleResponse = async(airline, flight, timestamp) => {

    for (let i = 0; i < this.oracles.length; i++) {
      const statusCode = this.status[Math.floor(Math.random() * this.status.length)];

      try {
        let idxs = await flightSuretyApp.methods.getMyIndexes().call({from: this.oracles[i]});

        for(let y = 0; y < idxs.length; y++) {
          try {
            await flightSuretyApp.methods.submitOracleResponse(idxs[y], airline, flight, timestamp, statusCode)
                                         .send({from: this.oracles[i], gas: 3000000});
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
    let self = this;
    const numRegisteredFlights = await flightSuretyData.methods.registeredFlights().call();
    console.log('${numRegisteredFlights} registered flights');

    self.flightsForPurchase = [];
    self.flightsLanded = [];

    for (let i = 0; i < parseInt(numRegisteredFlights); i++) {
      try {
        let flightKey = await flightSuretyData.methods.getFlightKeyIndex(i).call();
        let flight = await flightSuretyData.methods.flights(flightKey).call();
        flight.flightKey = flightKey;
        if (flight.statusCode === "0") {
          self.flightsForPurchase.push(flight);
        } else {
          self.flightsLanded.push(flight);
        }
      } catch (error) {
        console.log(e);
      }
    }
  }

  listenEvents = async () => {
    let self = this;

    flightSuretyApp.events.OracleReport({}, function (error, event) {
      if (error) console.log(error);
      console.log('OracleReport: ' + '/n' + event.returnValues + '/n' + '-----------------------');
    });

    flightSuretyApp.events.OracleRequest({}, async (error, event) => {
      if (error) console.log(error);
      console.log('OracleRequest: ' + '/n' + event.returnValues + '/n' + '-----------------------');
      const {airline, flight, timestamp} = event.returnValues;
      await self.submitOracleResponse(airline, flight, timestamp);
    });

    flightSuretyApp.events.FlightStatusInfo({}, function (error, event) {
      if (error) console.log(error);
      console.log('FlightStatusInfo: ' + '/n' + event.returnValues + '/n' + '-----------------------');
    });

    flightSuretyData.events.AirlineFunded({}, function (error, event) {
      if (error) console.log(error);
      console.log('AirlineFunded: ' + '/n' + event.returnValues + '/n' + '-----------------------');
    });

    flightSuretyData.events.FlightRegistered({}, function (error, event) {
      if (error) console.log(error);
      console.log('FlightRegistered: ' + '/n' + event.returnValues + '/n' + '-----------------------');
      self.getRegisteredFlights();
    });

    flightSuretyData.events.PassengerInsured({}, function (error, event) {
      if (error) console.log(error);
      console.log('PassengerInsured: ' + '/n' + event.returnValues + '/n' + '-----------------------');
    });

    flightSuretyData.events.FlightStatusUpdated({}, function (error, event) {
      if (error) console.log(error);
      console.log('FlightStatusUpdated: ' + '/n' + event.returnValues + '/n' + '-----------------------');
      self.getRegisteredFlights();
    });

    flightSuretyData.events.AccountWithdrawal({}, function (error, event) {
      if (error) console.log(error);
      console.log('AccountWithdrawal: ' + '/n' + event.returnValues + '/n' + '-----------------------');
    });
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


