exports.id=0,exports.modules={"./src/server/server.js":function(t,n,r){"use strict";r.r(n);r("@babel/polyfill");var s=r("./build/contracts/FlightSuretyApp.json"),o=r("./build/contracts/FlightSuretyData.json"),a=r("truffle-contract"),i=r.n(a),c=r("web3"),l=r.n(c),u=r("express"),g=r.n(u);function h(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function f(e,t,n,r,s,o,a){try{var i=e[o](a),c=i.value}catch(e){return void n(e)}i.done?t(c):Promise.resolve(c).then(r,s)}function d(e){return function(){var t=this,n=arguments;return new Promise(function(r,s){var o=e.apply(t,n);function a(e){f(o,r,s,a,i,"next",e)}function i(e){f(o,r,s,a,i,"throw",e)}a(void 0)})}}function p(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function v(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var m=r("body-parser"),x=r("cors"),b=new l.a(new l.a.providers.HttpProvider("http://localhost:7545")),R=b.eth.getAccounts();b.eth.defaultAccount="0x55690752ed06B1d37510D20B3516b2D12F007f6d";var w=i()(s),y=i()(o),F=function(){function e(t){p(this,e),this.app=g()(),this.contractServer=t,this.initExpressMiddleWare(),this.getInformation(),this.getFlights()}var t,n,r;return t=e,(n=[{key:"initExpressMiddleWare",value:function(){this.app.use(m.urlencoded({extended:!0})),this.app.use(m.json()),this.app.use(x())}},{key:"getFlights",value:function(){var e=this;this.app.get("/flights",function(){var t=d(regeneratorRuntime.mark(function t(n,r){return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.contractServer.getRegisteredFlights();case 2:r.json({flightsForPurchase:e.contractServer.flightsForPurchase,flightsLanded:e.contractServer.flightsLanded});case 3:case"end":return t.stop()}},t)}));return function(e,n){return t.apply(this,arguments)}}())}},{key:"getInformation",value:function(){this.app.get("/",function(e,t){t.json({endpoints:[{"/":{method:"GET",description:"An API for use with your Dapp"},"/flights":{method:"GET",description:"List of flights"}}]})})}}])&&h(t.prototype,n),r&&h(t,r),e}(),k=new function t(){var n=this;p(this,t),v(this,"init",d(regeneratorRuntime.mark(function e(){var t,r,s,o;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return w.setProvider(b.currentProvider),y.setProvider(b.currentProvider),e.prev=2,e.next=5,w.deployed();case 5:return t=e.sent,e.next=8,y.deployed();case 8:return r=e.sent,s=t.address,e.next=12,R;case 12:return o=e.sent,e.next=15,r.authorizeCaller(s,{from:o[0]});case 15:e.next=22;break;case 17:e.prev=17,e.t0=e.catch(2),console.log(e.t0.toString()),console.error("Check if Ganache is running and contracts deployed properly!"),process.exit();case 22:n.registerOracles(),n.listenEvents(),n.getRegisteredFlights();case 25:case"end":return e.stop()}},e,null,[[2,17]])}))),v(this,"registerOracles",d(regeneratorRuntime.mark(function e(){var t,r,s,o,a;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,w.deployed();case 2:return e.sent,e.next=5,y.deployed();case 5:return e.sent,t=n,e.next=9,w.methods.REGISTRATION_FEE().call();case 9:return r=e.sent,e.next=12,R;case 12:s=e.sent,o=config.numOracles<s.length?config.numOracles:s.length-1,a=1;case 15:if(!(a<o)){e.next=28;break}return e.prev=16,t.oracles.push(s[a]),e.next=20,w.methods.registerOracle().send({from:s[a],value:r,gas:3e6});case 20:e.next=25;break;case 22:e.prev=22,e.t0=e.catch(16),console.log(e.t0.toString());case 25:a++,e.next=15;break;case 28:case"end":return e.stop()}},e,null,[[16,22]])}))),v(this,"submitOracleResponse",(r=d(regeneratorRuntime.mark(function e(t,r,s){var o,a,i,c;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:o=0;case 1:if(!(o<n.oracles.length)){e.next=28;break}return a=n.status[Math.floor(Math.random()*n.status.length)],e.prev=3,e.next=6,w.methods.getMyIndexes().call({from:n.oracles[o]});case 6:i=e.sent,c=0;case 8:if(!(c<i.length)){e.next=20;break}return e.prev=9,e.next=12,w.methods.submitOracleResponse(i[c],t,r,s,a).send({from:n.oracles[o],gas:3e6});case 12:e.next=17;break;case 14:e.prev=14,e.t0=e.catch(9),console.log(e.t0.toString());case 17:c++,e.next=8;break;case 20:e.next=25;break;case 22:e.prev=22,e.t1=e.catch(3),console.log(e.t1);case 25:o++,e.next=1;break;case 28:case"end":return e.stop()}},e,null,[[3,22],[9,14]])})),function(e,t,n){return r.apply(this,arguments)})),v(this,"getRegisteredFlights",d(regeneratorRuntime.mark(function t(){var r,s,o,a,i;return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return r=n,t.next=3,y.methods.getRegisteredFlights().call();case 3:s=t.sent,console.log(s+" registered flights"),r.flightsForPurchase=[],r.flightsLanded=[],o=0;case 8:if(!(o<parseInt(s))){t.next=26;break}return t.prev=9,t.next=12,y.methods.getFlightKeyIndex(o).call();case 12:return a=t.sent,t.next=15,y.methods.flights(a).call();case 15:(i=t.sent).flightKey=a,"0"===i.statusCode?r.flightsForPurchase.push(i):r.flightsLanded.push(i),t.next=23;break;case 20:t.prev=20,t.t0=t.catch(9),console.log(e);case 23:o++,t.next=8;break;case 26:case"end":return t.stop()}},t,null,[[9,20]])}))),v(this,"listenEvents",d(regeneratorRuntime.mark(function e(){var t;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:t=n,w.events.OracleReport({},function(e,t){e&&console.log(e),console.log("OracleReport: /n"+t.returnValues+"/n-----------------------")}),w.events.OracleRequest({},function(){var e=d(regeneratorRuntime.mark(function e(n,r){var s,o,a,i;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n&&console.log(n),console.log("OracleRequest: /n"+r.returnValues+"/n-----------------------"),s=r.returnValues,o=s.airline,a=s.flight,i=s.timestamp,e.next=5,t.submitOracleResponse(o,a,i);case 5:case"end":return e.stop()}},e)}));return function(t,n){return e.apply(this,arguments)}}()),w.events.FlightStatusInfo({},function(e,t){e&&console.log(e),console.log("FlightStatusInfo: /n"+t.returnValues+"/n-----------------------")}),y.events.AirlineFunded({},function(e,t){e&&console.log(e),console.log("AirlineFunded: /n"+t.returnValues+"/n-----------------------")}),y.events.FlightRegistered({},function(e,n){e&&console.log(e),console.log("FlightRegistered: /n"+n.returnValues+"/n-----------------------"),t.getRegisteredFlights()}),y.events.PassengerInsured({},function(e,t){e&&console.log(e),console.log("PassengerInsured: /n"+t.returnValues+"/n-----------------------")}),y.events.FlightStatusUpdated({},function(e,n){e&&console.log(e),console.log("FlightStatusUpdated: /n"+n.returnValues+"/n-----------------------"),t.getRegisteredFlights()}),y.events.AccountWithdrawal({},function(e,t){e&&console.log(e),console.log("AccountWithdrawal: /n"+t.returnValues+"/n-----------------------")});case 9:case"end":return e.stop()}},e)}))),this.flightsForPurchase=[],this.flightsLanded=[],this.oracles=[],this.status=[20,30,40,50,0];var r};k.init();var P=new F(k);n.default=P}};