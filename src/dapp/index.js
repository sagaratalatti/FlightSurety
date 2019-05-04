import DOM from './dom';
import Contract from './contract';
import $ from 'jquery';
window.jQuery = $;
window.$ = $;
import './assets/css/creative.css';
import './assets/select2/select2.css';
import './assets/css/form.css';
import './assets/bootstrap/bootstrap.bundle.min.js';
import './assets/jquery-easing/jquery.easing.min.js';
import './assets/creative.js';
import AWN from 'awesome-notifications';


(async() => {

    let result = null;

    function getFlights() {
        (async() => {
            console.log('updating flights ....');
            try {
                let response = await fetch('http://localhost:3000/flights');
                let flights = await response.json();
                $("#flightsPurchase").find('option').remove();
                for (let i=0; i < flights.flightsForPurchase.length; i++) {
                    let flight = flights.flightsForPurchase[i];
                    $("#flightsPurchase").append(
                        new Option(`${flight.flight} ${flight.departure}/${flight.destination}`,
                            `${flight.airline}-${flight.flight}-${flight.timestamp}`));
                }
                $("#ftc-events").find('li').remove();
                for (let i=0; i < flights.flightsLanded.length; i++) {
                    let flight = flights.flightsLanded[i];
                    $("#ftc-events").prepend(`<li class="m-auto">${flight.flight} ${flight.departure}/${flight.destination} ${flight.status_code}</li>`);
                }
                $("#ftc-events").prepend('<li><h6 class="text-center">LANDED FLIGHTS</h6></li>');
            }catch(e) {
                console.log(e);
            }
        })();
    }
    getFlights();

    let contract = new Contract('localhost', () => {
        // Read transaction
        contract.isOperational((error, result) => {
            if (error) {
                console.log(error);
            } else {
                console.log("success");
            }
        });

        contract.getFundingValue((error, result) => {
            if (error) {
                 console.log(error)
            } else {
                try {
                    let fundingValue = $("fundingPrice");
                    console.log(result.toString());
                    fundingValue.html(price);
                }
                catch (e) {
                    console.log(e)
                }
            }
        });

        contract.getInsuranceCost((error, result) => {
            if (error) {
                console.log(error);
            } else {
                try {
                    let insPrice = $("insurancePrice");
                    insPrice.html(result);
                    console.log(result);
                }
                catch(e) {
                    console.log(e)
                }
            }
        });

        function getBalance() {
            contract.pendingWithdrawals((error, result) => {
                let price = 0;
                if (error) {
                    console.log(error);
                }else{
                    try {
                        price = web3.utils.fromWei(result, 'ether');
                    } catch(e) {
                        console.log(e);
                    }
                }
                let claimAmount = $("#claimAmount");
                claimAmount.html(price);
            });
        }

        getBalance();



        DOM.elid('#registerAirline').addEventListener('click', () => {
            const airline = $("#newAirline").val();
            if (airline) {
                contract.registerAirline(airline, (error, result) => {
                    console.log(error, result);
                });
            } else {
                alert("You need to insert an airline address");
            }

        });

        DOM.elid('#fundAirline').addEventListener('click', () => {
            contract.fundAirline((error, result) => {
                console.log(error, result);
            });
        });

        DOM.elid('#registerFlight').addEventListener('click', () => {
            const flightNumber = $("#flightNumber").val();
            const departure = $("#departure").val();
            const destination = $("#destination").val();
            if (flightNumber && departure && destination) {
                contract.registerFlight(flightNumber, departure, destination, (error, result) => {
                    console.log(error, result);
                });
            } else {
                alert("Make sure to insert a flight number, departure and destination");
            }
        });

        DOM.elid('#purchaseInsurance').addEventListener('click', () => {
            try {
                let data = $("#flightsPurchase").val().split('-');
                if (data.length === 3) {
                    contract.buyInsurance(data[0], data[1], data[2], (error, result) => {
                        console.log(error, result);
                     });
                }
            }catch(e){
                console.log("Invalid data");
            }
        });

        DOM.elid('#refreshFlights').addEventListener('click', () => {
            console.log('reloading flights list');
            getFlights();
        });

        DOM.elid('claim').addEventListener('click', () => {
            let self = this;
            contract.pay((error, result) => {
                console.log(error, result);
                getBalance();
            });
        });

        DOM.elid('balance').addEventListener('click', () => {
            getBalance();
        })


        DOM.elid('#flightStatus').addEventListener('click', () => {
            try {
                let data = $("#flightsPurchase").val().split('-');
                if (data.length === 3) {
                    contract.fetchFlightStatus(data[0], data[1], data[2], (error, result) => {
                        console.log(error, result);
                    });
                }
            }catch(e){
                console.log("Invalid data");
            }
        });
    });

})();




