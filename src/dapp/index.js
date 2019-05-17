/* eslint-disable no-console */
/* eslint-disable no-undef */
import './assets/css/creative.css';
import './assets/select2/select2.css';
import './assets/css/form.css';
import './assets/creative.js';
import contract from 'truffle-contract';
import Web3 from 'web3'
import AWN from 'awesome-notifications';
import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import FlightSuretyData from '../../build/contracts/FlightSuretyData.json';

var flightSuretyApp = contract(FlightSuretyApp);
var flightSuretyData = contract(FlightSuretyData);

var account;
var accounts;

const App = {

    start : async () => {

        flightSuretyApp.setProvider(web3.currentProvider);
        flightSuretyData.setProvider(web3.currentProvider);

        web3.eth.getAccounts(function (error, accs) {
            if (error != null) {
                alert('There was an error fetching your accounts.')
                return
            } if (accs.length === 0) {
                alert("Couldn't get any accounts! Make sure Ethereum client is configured correctly")
                return
            }

            accounts = accs;
            account = accounts[0];
        });

        window.ethereum.on('accountsChanged', function (accounts) {
            account = accounts[0];
            console.log("Using address: " + accounts[0]);
        });

        const flightApp = await flightSuretyApp.deployed();
        const flightData = await flightSuretyData.deployed();

        var registered = await flightData.hasAirlineRegistered(account);

        console.log('Airline Registered: ' + registered);

        console.log('FlightApp Address: ' + flightApp.address);
        console.log('FlightData Address: ' + flightData.address);

        if (await flightApp.isOperational({from: account})) {
            console.log('It is Operational');
        } else {
            console.log('Not Operational');
        }

        App.getFlights();
    },

    getFlights : async() => {
        console.log('updating flights...');

        try {
            let response = await fetch('http://localhost:3000/flights');
            let flights = await response.json();
            const flightsPurchase = document.getElementById('flightsPurchase');

            for (let i=0; i < flights.flightsForPurchase.length; i++) {
                let flight = flights.flightsForPurchase[i];
                flightsPurchase.append(
                    new Option(`${flight.flight} ${flight.departure}/${flight.destination}`,
                    `${flight.airline}-${flight.flight}-${flight.timestamp}`)
                )
            }

            for (let i = 0; i < flights.flightsLanded.length; i++) {
                let flight = flights.flightsLanded[i];

            }
        } catch (error) {
            console.log(error);
        }
    },

    getBalance : async() => {
        const flightData = await flightSuretyData.deployed();
        document.getElementById('claimAmount').value = web3.utils.fromWei(flightData.pendingWithdrawals(account), {from: account});
    },

    fundAirline : async() => {
        const flightApp = await flightSuretyApp.deployed();
        await flightApp.fundAirline({from: account, value: web3.utils.toWei('10', 'ether'), gas: 3000000});
    },

    registerAirline : async() => {
        const flightApp = await flightSuretyApp.deployed();

        const airline = document.getElementById('airlineAddress').value;

        await flightApp.registerAirline(airline, {from: account});
    },

    registerFlight : async() => {
        const flightApp = await flightSuretyApp.deployed();
        const timestamp = Math.floor(Date.now() / 1000);

        const flightNumber = document.getElementById('flightNumber').value;
        const departure = document.getElementById('Departure').value;
        const destination = document.getElementById('Destination').value;

        await flightApp.registerFlight(flightNumber, timestamp, departure, destination, {from: account});
    },

    buyInsurance : async() => {
        const flightApp = await flightSuretyApp.deployed();
        let insuranceValue = flightApp.INSURANCE_COST();

        flightApp.buy(airline, flight, timestamp, {from: account, value: insuranceValue.toString(), gas: 3000000});
    },

    fetchFlightStatus : async() => {
        const flightApp = await flightSuretyApp.deployed();

        flightApp.fetchFlightStatus(airline, flight, timestamp, {from: account});
    },

    pay : async() => {
        const flightApp = await flightSuretyApp.deployed();

        flightApp.pay({from: account, gas: 3000000});
    },

    balance : async() => {
        const flightData = await flightSuretyData.deployed();
        web3.eth.getBalance(flightData.address);
    }

}

window.App = App;

window.addEventListener('load', async() => {
    if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        try {
            await ethereum.enable();
            console.log(window.web3.isConnected())
        } catch (error){
            alert('User has denied access to ethereum');
        }
    } else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider);
        console.log(web3.isConnected())
    } else {
        console.warn(
            'No web3 detected. Falling back to http://127.0.0.1:7545.' +
            ' You should remove this fallback when you deploy live, as it\'s inherently insecure.' +
            ' Consider switching to Metamask for development.' +
            ' More info here: http://truffleframework.com/tutorials/truffle-and-metamask'
        )

        window.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'))
        console.log(web3.isConnected())
    }

    App.start();
});






