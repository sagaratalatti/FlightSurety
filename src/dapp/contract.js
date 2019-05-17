import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import FlightSuretyData from '../../build/contracts/FlightSuretyData.json';
import Config from './config.json';
import Web3 from 'web3';

export default class Contract {
    
    constructor(network, callback) {
        let config = Config[network];
        this.initWeb3();
        this.flightSuretyApp = new this.web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);
        this.flightSuretyData = new this.web3.eth.Contract(FlightSuretyData.abi, config.dataAddress);
        this.airlines = [];
        this.passengers = [];
        this.flightsForPurchase = [];
        this.flightsLanded = [];
        this.initialize(callback);
        let self = this;

        window.ethereum.on('accountsChanged', function (accounts) {
            self.initialize(callback);
        });
    }

    initWeb3 = async (config) => {
        if (window.ethereum) {
            this.web3 = new Web3(ethereum);
            try {
                await ethereum.enable();
            } catch (error) {
                console.log('User denied access or make sure MetaMask is installed!');
            }
        } else if (window.web3) {
            this.web3 = new Web3(web3.currentProvider);
        } else {
            this.web3 = new Web3.providers.WebsocketProvider(config.url.replace('http', 'ws'));
        }
    }

    initialize(callback) {
        this.web3.eth.getAccounts((error, accounts) => {
            if (accounts) {
                this.account = accounts[0];
                console.log(`Now using ${this.account} as default account.`);
            }
            callback();
        });
    }

    isOperational(callback) {
        this.flightSuretyApp.methods
                            .isOperational()
                            .call({from: this.account}, callback);
    }

    getInsuranceCost(callback) {
        this.flightSuretyApp.methods.INSURANCE_COST().call({from: this.account}, callback);
    }

    getFundingValue(callback) {
        this.flightSuretyApp.methods.AIRLINE_FUNDING_VALUE().call({from: this.account}, callback);
    }

    isFunded(callback) {
        this.flightSuretyData.methods.isAirlineFunded(this.owner).call({from: this.account}, callback);
    }

    fundAirline(callback) {
        this.FlightSuretyApp.methods
                            .fundAirline()
                            .send({from: this.account, value: this.web3.utils.toWei('10', 'ether'), gas: 3000000}, callback);   
    }

    registerAirline(airline, callback) {
        this.flightSuretyApp.methods
                            .registerAirline(airline)
                            .send({from: this.account}, callback);
    }

    registerFlight(flightNumber, departure, destination, callback) {
        const timestamp = Math.floor(Date.now() / 1000);
        this.flightSuretyApp.methods
                            .registerFlight(flightNumber, timestamp, departure, destination)
                            .send({from: this.account}, callback);
    }

    buyInsurance(airline, flight, timestamp, callback) {
        (async() => {
            let insValue = await this.FlightSuretyApp.methods.INSURANCE_COST().call();
            this.flightSuretyApp.methods
                                .buy(airline, flight, timestamp)
                                .send({from: this.account, value: insValue.toString(), gas: 3000000}, callback);
        })();
    }

    fetchFlightStatus(airline, flight, timestamp, callback) {
        this.flightSuretyApp.methods
                            .fetchFlightStatus(airline, flight, timestamp)
                            .send({from: this.account}, (error, result) => {
                                callback(error, result);
                            });
    }

    pay(callback) {
        this.flightSuretyApp.methods
                            .pay()
                            .send({from: this.account, gas: 3000000}, callback);
    }

    balance(callback) {
        web3.eth.getBalance(this.flightSuretyApp._address);
        callback;
    }

}