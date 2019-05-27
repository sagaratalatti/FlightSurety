/* eslint-disable no-console */
/* eslint-disable no-undef */
import './assets/css/creative.css';
import './assets/select2/select2.css';
import './assets/css/form.css';
import './assets/creative.js';
import contract from 'truffle-contract';
import Web3 from 'web3'
import AWN from 'awesome-notifications';
import 'awesome-notifications/dist/index.js';
import 'awesome-notifications/dist/style.css';
import bigNumber from 'bignumber.js';
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

        if (await flightApp.isOperational({from: account})) {
            new AWN().success('FlightSurety is Operational', {durations: {success: 5000 }});
        } else {
            new AWN().alert('FlightSurety is not Operational', {durations: {alert: 5000 }});
        }
    },

    getFlights : async() => {
        new AWN().info("Updating Flights...", {durations: {info: 5000 }, labels: {info: 'Requesting Flights'}});

        try {
            let response = await fetch('http://localhost:3000/flights');
            let flights = await response.json();
            const flightsPurchase = document.getElementById('flightsPurchase');

            for (let i=0; i < flights.flightsForPurchase.length; i++) {
                let flight = flights.flightsForPurchase[i];
                console.log(flight);
                var options = document.createElement('option');
                
                options.appendChild(document.createTextNode(`${flight.flight} ${flight.departure}/${flight.destination}`))
                options.value = `${flight.airline}-${flight.flight}-${flight.timestamp}-${flight.flightKey}`;
                flightsPurchase.appendChild(options);
            }
            
            for (let i = 0; i < flights.flightsLanded.length; i++) {
                let flight = flights.flightsLanded[i];
                new AWN().info(`${flight.flight} | ${flight.departure} | ${flight.destination} ${flight.statusCode}`, {durations: {info: 5000 }, labels: {info: 'Flights Landed'}});
            }
        } catch (error) {
            console.log(error);
        }
    },

    getBalance : async() => {
        const flightData = await flightSuretyData.deployed();
        let balance = await flightData.pendingWithdrawals(account, {from: account});
        new AWN().info(web3.utils.fromWei(balance).toString() + " ETH", {durations: {info: 5000 }, labels: {info: 'Insurance Claim'}});
        console.log(web3.utils.fromWei(balance));
    },

    fundAirline : async() => {
        const flightApp = await flightSuretyApp.deployed();
        await flightApp.fundAirline({from: account, value: web3.utils.toWei('10', 'ether'), gas: 3000000});
    },

    registerAirline : async() => {
        const airline = document.getElementById('airlineAddress').value;
        accounts[1] = airline.toString();
        console.log('Airline Address: ' + accounts[1]);
        const flightApp = await flightSuretyApp.deployed();
        await flightApp.registerAirline(accounts[1], {from: account});
    },

    registerFlight : async() => {
        const flightApp = await flightSuretyApp.deployed();
        const timestamp = Math.floor(Date.now() / 1000);
        console.log('Flight Timestamp ' + timestamp);
        const flightNumber = document.getElementById('flightNumber').value;
        const departure = document.getElementById('departure').value;
        const destination = document.getElementById('destination').value;

        await flightApp.registerFlight(flightNumber, timestamp.toString(), departure, destination, {from: account});
    },

    buyInsurance : async() => {
        const flightApp = await flightSuretyApp.deployed();
        const flightData = document.getElementById('flightsPurchase').value.split('-');
        if (flightData.length === 4) {
            flightApp.buyInsurance(flightData[0], flightData[1], flightData[2], flightData[3], {from: account, value:  web3.utils.toWei('1', 'ether'), gas: 3000000});
        }   
    },

    fetchFlightStatus : async() => {
        const flightApp = await flightSuretyApp.deployed();
        const flightData = document.getElementById('flightsPurchase').value.split('-');
        if (flightData === 3) {
            flightApp.fetchFlightStatus(flightData[0], flightData[1], flightData[2], {from: account});
        }
        
    },

    pay : async() => {

        const flightApp = await flightSuretyApp.deployed();

        flightApp.pay({from: account, gas: 3000000});
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






