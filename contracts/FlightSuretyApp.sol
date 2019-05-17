pragma solidity ^0.5.6;

// It's important to avoid vulnerabilities due to numeric overflow bugs
// OpenZeppelin's SafeMath library, when used correctly, protects agains such bugs
// More info: https://www.nccgroup.trust/us/about-us/newsroom-and-events/blog/2018/november/smart-contract-insecurity-bad-arithmetic/

import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";

/************************************************** */
/* FlightSurety Smart Contract                      */
/************************************************** */
contract FlightSuretyApp {
    
    using SafeMath for uint256; // Allow SafeMath functions to be called for all uint256 types (similar to "prototype" in Javascript)

    /********************************************************************************************/
    /*                                       DATA VARIABLES                                     */
    /********************************************************************************************/

    // Flight status codees
    uint8 private constant STATUS_CODE_UNKNOWN = 0;
    uint8 private constant STATUS_CODE_ON_TIME = 10;
    uint8 private constant STATUS_CODE_LATE_AIRLINE = 20;
    uint8 private constant STATUS_CODE_LATE_WEATHER = 30;
    uint8 private constant STATUS_CODE_LATE_TECHNICAL = 40;
    uint8 private constant STATUS_CODE_LATE_OTHER = 50;

    uint256 public constant INSURANCE_COST = 1 ether;
    uint256 private constant INSURANCE_MULTIPLIER = 150;
    uint256 public constant AIRLINE_FUNDING_VALUE = 10 ether;
    uint256 private constant MULTIPARTY_MINMUM_AIRLINES = 4;
    uint256 private constant MULTIPARTY_CONSENSUS_DIVIDER = 2;

    mapping(address => address[]) private airlineMultiCallers;


    address private contractOwner;          // Account used to deploy contract
    FlightSuretyData flightSuretyData;     // Contract Data 

    

 
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
         // Modify to call data contract's status
        require(isOperational(), "Contract is currently not operational");  
        _;  // All modifiers require an "_" which indicates where the function body will be added
    }

    modifier requireRegisteredAirline(address airline) {
        require(flightSuretyData.hasAirlineRegistered(airline), "Sender is not registered airline");
        _;
    }

    /**
    * @dev Modifier that requires the "ContractOwner" account to be the function caller
    */
    modifier requireContractOwner() {
        require(msg.sender == contractOwner, "Caller is not contract owner");
        _;
    }

    modifier paidEnough(uint256 value) {
        require(msg.value >= value, "Insufficient value");
        _;
    }

    modifier checkValue(uint256 amount) {
        _;
        uint amountToReturn = msg.value - amount;
        msg.sender.transfer(amountToReturn);
    }

    modifier airlineIsFunded(address airline) {
        require(flightSuretyData.hasAirlineFunded(airline), "Airline is not funded!");
        _;
    }

    modifier airlineIsNotRegistered(address airline) {
        require(!flightSuretyData.hasAirlineRegistered(airline), "Airline has already registered!");
        _;
    }

    modifier passengerIsNotInsured(bytes32 flightKey, address passenger) {
        require(!flightSuretyData.isPassengerInsured(flightKey, passenger), "Passenger is already insured for flight");
        _;
    }

    modifier flightIsNotRegistered(bytes32 flightKey) {
        require(!flightSuretyData.hasFlightRegistered(flightKey), "Flight is already registered!");
        _;
    }

    modifier flightIsRegistered(bytes32 flightKey) {
        require(!flightSuretyData.hasFlightRegistered(flightKey), "Flight is not registered!");
        _;
    }

    modifier flightIsNotLanded(bytes32 flightKey) {
        require(!flightSuretyData.hasFlightLanded(flightKey));
        _;
    }

    /********************************************************************************************/
    /*                                       CONSTRUCTOR                                        */
    /********************************************************************************************/

    /**
    * @dev Contract constructor
    *
    */
    constructor(address contractAddress) public {
        contractOwner = msg.sender;
        flightSuretyData = FlightSuretyData(contractAddress);
    }

    /********************************************************************************************/
    /*                                       UTILITY FUNCTIONS                                  */
    /********************************************************************************************/

    function isOperational() public view returns (bool) {
        return flightSuretyData.isOperational();  // Modify to call data contract's status
    }

    function isFlightRegistered(address airline, string memory flight, uint256 timestamp) public view returns (bool) {
        bytes32 flightKey = getFlightKey(airline, flight, timestamp);
        return flightSuretyData.hasFlightRegistered(flightKey);
    }

    function isPassengerInsuredForFlight(address airline, string memory flight, uint256 timestamp, address passenger) public view returns (bool) {
        bytes32 flightKey  = getFlightKey(airline, flight, timestamp);
        return flightSuretyData.isPassengerInsured(flightKey, passenger);
    }

    /********************************************************************************************/
    /*                                     SMART CONTRACT FUNCTIONS                             */
    /********************************************************************************************/

  
   /**
    * @dev Add an airline to the registration queue
    *
    */ 

    function fundAirline() external payable requireIsOperational requireRegisteredAirline(msg.sender) paidEnough(AIRLINE_FUNDING_VALUE) checkValue(AIRLINE_FUNDING_VALUE) {
        address(uint160(address(flightSuretyData))).transfer(msg.value);
        flightSuretyData.fundAirline(msg.sender);
    } 

    function getRegisteredAirlines() public view returns (uint256) {
        return flightSuretyData.getRegisteredAirlines();
    }

    function registerAirline(address airline) external requireIsOperational() airlineIsFunded(msg.sender) airlineIsNotRegistered(airline) returns (bool success, uint256 votes) {
        if (getRegisteredAirlines() < MULTIPARTY_MINMUM_AIRLINES) {
            flightSuretyData.registerAirline(airline, msg.sender);
            airlineMultiCallers[airline] = [msg.sender];
            return (success, airlineMultiCallers[airline].length);
        } else {
            bool isDuplicate = false;
            for (uint c = 0; c < airlineMultiCallers[airline].length; c ++) {
                if (airlineMultiCallers[airline][c] == msg.sender) {
                    isDuplicate = true;
                    break;
                }
            }
            require(!isDuplicate, "Voting airline has already submitted vote for this new airline");

            airlineMultiCallers[airline].push(msg.sender);
            if (airlineMultiCallers[airline].length >= getRegisteredAirlines().div(MULTIPARTY_CONSENSUS_DIVIDER)) {
                flightSuretyData.registerAirline(airline, msg.sender);
                return (success, airlineMultiCallers[airline].length);
            }

            return (false, airlineMultiCallers[airline].length);
        }
    }

    function registerFlight(string calldata flight, uint256 timestamp, string calldata departure, string calldata destination) external 
    requireIsOperational airlineIsFunded(msg.sender) 
    flightIsNotRegistered(getFlightKey(msg.sender, flight, timestamp)) {
        bytes32 flightKey = getFlightKey(msg.sender, flight, timestamp);
        flightSuretyData.registerFlight(flightKey, msg.sender, flight, timestamp, departure, destination);
    }

    function buyInsurance(address airline, string calldata flight, uint256 timestamp) external payable requireIsOperational() 
    flightIsRegistered(getFlightKey(airline, flight, timestamp)) 
    flightIsNotLanded(getFlightKey(airline, flight, timestamp)) 
    passengerIsNotInsured(getFlightKey(airline, flight, timestamp), msg.sender)
    paidEnough(INSURANCE_COST)
    checkValue(INSURANCE_COST) {
        uint256 amount = msg.value;
        address(uint160(address(flightSuretyData))).transfer(INSURANCE_COST);
        flightSuretyData.buy(getFlightKey(airline, flight, timestamp), msg.sender, amount, INSURANCE_MULTIPLIER);
    }

    function processFlightStatus(address airline, string memory flight, uint256 timestamp, uint8 statusCode) internal {
        bytes32 flightKey = getFlightKey(airline, flight, timestamp);
        flightSuretyData.updateFlightStatus(flightKey, statusCode);
    }

    function pay() public requireIsOperational {
        flightSuretyData.pay(address(uint160(address(msg.sender))));
    }

    function fetchFlightStatus(address airline, string calldata flight, uint256 timestamp) external {
        uint8 index = getRandomIndex(msg.sender);

        bytes32 key = keccak256(abi.encodePacked(index, airline, flight, timestamp));
        oracleResponses[key] = ResponseInfo ({
            requester: msg.sender,
            isOpen: true
        });

        emit OracleRequest(index, airline, flight, timestamp);
    }


// region ORACLE MANAGEMENT

    // Incremented to add pseudo-randomness at various points
    uint8 private nonce = 0;    

    // Fee to be paid when registering oracle
    uint256 public constant REGISTRATION_FEE = 1 ether;

    // Number of oracles that must respond for valid status
    uint256 private constant MIN_RESPONSES = 3;


    struct Oracle {
        bool isRegistered;
        uint8[3] indexes;        
    }

    // Track all registered oracles
    mapping(address => Oracle) private oracles;

    // Model for responses from oracles
    struct ResponseInfo {
        address requester;                              // Account that requested status
        bool isOpen;                                    // If open, oracle responses are accepted
        mapping(uint8 => address[]) responses;          // Mapping key is the status code reported                                                     // This lets us group responses and identify                                                     // the response that majority of the oracles
    }

    // Track all oracle responses
    // Key = hash(index, flight, timestamp)
    mapping(bytes32 => ResponseInfo) private oracleResponses;

    // Event fired each time an oracle submits a response
    event FlightStatusInfo(address airline, string flight, uint256 timestamp, uint8 status);

    event OracleReport(address airline, string flight, uint256 timestamp, uint8 status);

    // Event fired when flight status request is submitted
    // Oracles track this and if they have a matching index
    // they fetch data and submit a response
    event OracleRequest(uint8 index, address airline, string flight, uint256 timestamp);


    // Register an oracle with the contract
    function registerOracle() external payable {
        // Require registration fee
        require(msg.value >= REGISTRATION_FEE, "Registration fee is required");

        uint8[3] memory indexes = generateIndexes(msg.sender);

        oracles[msg.sender] = Oracle({ isRegistered: true, indexes: indexes });
    }

    function getMyIndexes() view external returns(uint8[3] memory) {
        require(oracles[msg.sender].isRegistered, "Not registered as an oracle");

        return oracles[msg.sender].indexes;
    }




    // Called by oracle when a response is available to an outstanding request
    // For the response to be accepted, there must be a pending request that is open
    // and matches one of the three Indexes randomly assigned to the oracle at the
    // time of registration (i.e. uninvited oracles are not welcome)
    function submitOracleResponse(uint8 index, address airline, string calldata flight, uint256 timestamp, uint8 statusCode) external {
        require((oracles[msg.sender].indexes[0] == index) || (oracles[msg.sender].indexes[1] == index) || (oracles[msg.sender].indexes[2] == index), "Index does not match oracle request");


        bytes32 key = keccak256(abi.encodePacked(index, airline, flight, timestamp)); 
        require(oracleResponses[key].isOpen, "Flight or timestamp do not match oracle request");

        oracleResponses[key].responses[statusCode].push(msg.sender);

        // Information isn't considered verified until at least MIN_RESPONSES
        // oracles respond with the *** same *** information
        emit OracleReport(airline, flight, timestamp, statusCode);
        if (oracleResponses[key].responses[statusCode].length >= MIN_RESPONSES) {

            emit FlightStatusInfo(airline, flight, timestamp, statusCode);

            // Handle flight status as appropriate
            processFlightStatus(airline, flight, timestamp, statusCode);
        }
    }


    function getFlightKey(address airline, string memory flight, uint256 timestamp) pure internal returns(bytes32) {
        return keccak256(abi.encodePacked(airline, flight, timestamp));
    }

    // Returns array of three non-duplicating integers from 0-9
    function generateIndexes(address account) internal returns(uint8[3] memory) {
        uint8[3] memory indexes;
        indexes[0] = getRandomIndex(account);
        
        indexes[1] = indexes[0];
        while(indexes[1] == indexes[0]) {
            indexes[1] = getRandomIndex(account);
        }

        indexes[2] = indexes[1];
        while((indexes[2] == indexes[0]) || (indexes[2] == indexes[1])) {
            indexes[2] = getRandomIndex(account);
        }

        return indexes;
    }

    // Returns array of three non-duplicating integers from 0-9
    function getRandomIndex(address account) internal returns (uint8) {
        uint8 maxValue = 10;

        // Pseudo random number...the incrementing nonce adds variation
        uint8 random = uint8(uint256(keccak256(abi.encodePacked(blockhash(block.number - nonce++), account))) % maxValue);

        if (nonce > 250) {
            nonce = 0;  // Can only fetch blockhashes for last 256 blocks so we adapt
        }

        return random;
    }
} 

contract FlightSuretyData {
    function isOperational() public view returns(bool);
    function hasAirlineFunded(address airline) external view returns (bool);
    function hasAirlineRegistered(address airline) external view returns (bool);
    function registerAirline(address newAirline, address registeredAirline) external;
    function fundAirline(address airline) payable external;
    function getRegisteredAirlines() public view returns (uint256);
    function isPassengerInsured(bytes32 flightKey, address passenger) external view returns (bool);
    function registerFlight(bytes32 flightKey, address airline, string calldata flight, uint256 timestamp, string calldata departure, string calldata destination) external;
    function hasFlightRegistered(bytes32 flightKey) public view returns (bool);
    function hasFlightLanded(bytes32 flightKey) public view returns (bool);
    function buy(bytes32 flightKey, address passenger, uint256 amount, uint256 multiplier) external payable;
    function updateFlightStatus(bytes32 flightKey, uint8 statusCode) external;
    function pay(address caller) external;
}
