pragma solidity ^0.5.6;

import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";

contract FlightSuretyData {
    
    using SafeMath for uint256;

    struct Airline {
        bool isRegistered;
        bool isFunded;
    }

    struct Flight {
        bool isRegistered;
        address airline;
        string flight;
        string departure;
        string destination;
        string timestamp;
        uint8 statusCode;
    }

    struct InsuredData {
        address passenger;
        //used to decouple insurance price and multiplier from data contract
        uint256 amount;
        uint256 multiplier;
        bool credited;
    }

    mapping(address => Airline) public airlines;
    uint256 public registeredAirlines;
    mapping(bytes32 => Flight) public flights;
    bytes32[] public registeredFlights;
    mapping(bytes32 => InsuredData[]) flightInsuredPassengers;
    mapping(address => uint) public pendingWithdrawals;

    /********************************************************************************************/
    /*                                       DATA VARIABLES                                     */
    /********************************************************************************************/

    address private contractOwner;                                      // Account used to deploy contract
    bool private operational = true;
    mapping(address => bool) private authorizedCallers;                                    // Blocks all state changes throughout the contract if false                                   

    /********************************************************************************************/
    /*                                       EVENT DEFINITIONS                                  */
    /********************************************************************************************/

    event AirlineRegistered(address airline);
    event AirlineFunded(address airline);
    event FlightRegistered(bytes32 flightKey);
    event PassengerInsured(bytes32 flightKey, address passenger);
    event FlightStatusUpdated(bytes32 flightKey, uint8 statusCode);
    event PassengerCredited(address passenger, uint256 amount);
    event AccountWithdrawal(address caller, uint256 amount);


    /**
    * @dev Constructor
    *      The deploying account becomes contractOwner
    */
    constructor(address airlineAddress) public {
        contractOwner = msg.sender;
        airlines[airlineAddress] = Airline(true, false);
        registeredAirlines = 1;
    }

    /********************************************************************************************/
    /*                                       FUNCTION MODIFIERS                                 */
    /********************************************************************************************/

    // Modifiers help avoid duplication of code. They are typically used to validate something
    // before a function is allowed to be executed.

    /**
    * @dev Modifier that requires the "operational" boolean variable to be "true"
    *      This is used on all state changing functions to pause the contract in 
    *      the event there is an issue that needs to be fixed
    */
    modifier requireIsOperational() {
        require(operational, "Contract is currently not operational");
        _;  // All modifiers require an "_" which indicates where the function body will be added
    }

    /**
    * @dev Modifier that requires the "ContractOwner" account to be the function caller
    */
    modifier requireContractOwner() {
        require(msg.sender == contractOwner, "Caller is not contract owner");
        _;
    }

    modifier isAuthorizedCaller() {
        require((authorizedCallers[msg.sender] == true), "Caller is not authorized contract");
        _;
    }

    modifier isAirlineRegistered(address airline) {
        require(airlines[airline].isRegistered, "Airline is not registered!");
        _;
    }

    modifier checkValue(uint256 price) {
        _;
        uint amountToReturn = msg.value - price;
        msg.sender.transfer(amountToReturn);
    }

    modifier isFlightRegistered(bytes32 flightKey) {
        require(flights[flightKey].isRegistered == true, "Flight is not Registered!");
        _;
    }

    modifier isFlightNotRegistered(bytes32 flightKey) {
        require(flights[flightKey].isRegistered == false, "Flight is already Registered!");
        _;
    }

    modifier isFlightNotLanded(bytes32 flightKey) {
        require(flights[flightKey].statusCode == 0, "Flight has already landed!");
        _;
    }

    modifier isAirlineFunded(address airline) {
        require(airlines[airline].isRegistered, "Airline not funded!");
        _;
    }



    /********************************************************************************************/
    /*                                       UTILITY FUNCTIONS                                  */
    /********************************************************************************************/

    /**
    * @dev Get operating status of contract
    *
    * @return A bool that is the current operating status
    */      
    function isOperational() public view returns(bool) {
        return operational;
    }

     /**
    * @dev Sets contract operations on/off
    *
    * When operational mode is disabled, all write transactions except for this one will fail
    */    
    function setOperatingStatus(bool mode) external requireContractOwner {
        operational = mode;
    }

    function getFlightKeyIndex(uint index) public view returns (bytes32) {
        return registeredFlights[index];
    }

    function getRegisteredFlights() public view returns (uint) {
        return registeredFlights.length;
    }

    function hasFlightLanded(bytes32 flightKey) public view returns (bool) {
        return flights[flightKey].statusCode > 0;
    }

    function hasFlightRegistered(bytes32 flightKey) public view returns (bool) {
        return flights[flightKey].isRegistered;
    }

    function isPassengerInsured(bytes32 flightKey, address passenger) external view returns (bool) {
        InsuredData[] memory insuredPassengers = flightInsuredPassengers[flightKey];
        for (uint i = 0; i < insuredPassengers.length; i++) {
            if (insuredPassengers[i].passenger == passenger) {
                return true;
            }
        }
        return false;
    } 

    function isAuthorized(address caller) public view returns (bool) {
        return authorizedCallers[caller];
    }

    function getRegisteredAirlines() public view returns (uint256) {
        return registeredAirlines;
    }

    function hasAirlineFunded(address airline) public view returns (bool) {
        return airlines[airline].isFunded;
    }

    function hasAirlineRegistered(address airline) public view returns (bool) {
        return airlines[airline].isRegistered;
    }

    function authorizeCaller(address caller) external requireContractOwner {
        authorizedCallers[caller] = true;
    }

    function deauthorizeCaller(address caller) external requireContractOwner {
        delete authorizedCallers[caller];
    }

    /********************************************************************************************/
    /*                                     SMART CONTRACT FUNCTIONS                             */
    /********************************************************************************************/

   /**
    * @dev Add an airline to the registration queue
    *      Can only be called from FlightSuretyApp contract
    *
    */

    function fundAirline(address airline) external payable requireIsOperational isAuthorizedCaller {
        address(0).transfer(msg.value);
        airlines[airline].isFunded = true;
        emit AirlineFunded(airline);
    }  

    function registerAirline(address airline, address caller) external requireIsOperational isAuthorizedCaller isAirlineFunded(caller) {
            airlines[airline] = Airline(true, false);
            registeredAirlines = registeredAirlines + 1;
            emit AirlineRegistered(airline);
    }

    function registerFlight(bytes32 flightKey, address airline, string memory flight, string memory timestamp, string memory departure, string memory destination) public payable requireIsOperational isAuthorizedCaller isAirlineFunded(airline) isFlightNotRegistered(flightKey) {
        flights[flightKey] = Flight(
            true,
            airline,
            flight,
            departure,
            destination,
            timestamp,
            0
        );

        registeredFlights.push(flightKey);
        emit FlightRegistered(flightKey);
    }

    function updateFlightStatus(bytes32 flightKey, uint8 statusCode) external requireIsOperational isAuthorizedCaller {
        if (flights[flightKey].statusCode == 0) {
            flights[flightKey].statusCode = statusCode;
            if (statusCode == 20) {
                creditInsurees(flightKey);
            }
        }
        emit FlightStatusUpdated(flightKey, statusCode);
    }

   /**
    * @dev Buy insurance for a flight
    *
    */   
    function buy(bytes32 flightKey, address passenger, uint256 amount, uint256 multiplier) external payable requireIsOperational isAuthorizedCaller isFlightRegistered(flightKey) isFlightNotLanded(flightKey) {
        address(0).transfer(msg.value);
        flightInsuredPassengers[flightKey].push(InsuredData(
            passenger,
            amount,
            multiplier,
            false
        ));

        emit PassengerInsured(flightKey, passenger);
    }

    /**
     *  @dev Credits payouts to insurees
    */
    function creditInsurees(bytes32 flightKey) internal requireIsOperational isAuthorizedCaller {
        for (uint i = 0; i < flightInsuredPassengers[flightKey].length; i++) {
            if (flightInsuredPassengers[flightKey][i].credited == false) {
                flightInsuredPassengers[flightKey][i].credited = true;
                uint256 amount = calculatePremium(flightInsuredPassengers[flightKey][i].amount,
                                                    flightInsuredPassengers[flightKey][i].multiplier);
               pendingWithdrawals[flightInsuredPassengers[flightKey][i].passenger] += amount;
               emit PassengerCredited(flightInsuredPassengers[flightKey][i].passenger, amount);                                     
            }
        }
    }

    function calculatePremium(uint256 amount, uint256 multiplier) private pure returns(uint256) {
        return amount.mul(multiplier).div(100);
    }
    

    /**
     *  @dev Transfers eligible payout funds to insuree
     *
    */
    function pay(address caller) external isAuthorizedCaller requireIsOperational {
        require(pendingWithdrawals[caller] > 0, "No funds available for withdrawal");
        uint256 amount = pendingWithdrawals[caller];
        pendingWithdrawals[caller] = 0;
        address(uint160(address(caller))).transfer(amount);
        emit AccountWithdrawal(caller, amount);
    }

    function getFlightKey(address airline, string memory flight, string memory timestamp) pure internal returns(bytes32) {
        return keccak256(abi.encodePacked(airline, flight, timestamp));
    }

}

