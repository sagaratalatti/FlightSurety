exports.id=0,exports.modules={"./src/server/server.js":function(t,n,r){"use strict";r.r(n);r("@babel/polyfill");var s=r("./build/contracts/FlightSuretyApp.json"),a=r("./build/contracts/FlightSuretyData.json"),o=r("truffle-contract"),c=r.n(o),i=r("./src/server/config.json"),l=r("web3"),u=r.n(l),g=r("express"),h=r.n(g);function f(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function p(e,t,n,r,s,a,o){try{var c=e[a](o),i=c.value}catch(e){return void n(e)}c.done?t(i):Promise.resolve(i).then(r,s)}function d(e){return function(){var t=this,n=arguments;return new Promise(function(r,s){var a=e.apply(t,n);function o(e){p(a,r,s,o,c,"next",e)}function c(e){p(a,r,s,o,c,"throw",e)}o(void 0)})}}function v(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function x(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var m=r("body-parser"),b=r("cors"),R=new i["http://localhost:7545"],y=new u.a(new u.a.providers.HttpProvider("http://localhost:7545")),w=y.eth.getAccounts();y.eth.defaultAccount="0x55690752ed06B1d37510D20B3516b2D12F007f6d";var F=c()(s),k=c()(a),P=function(){function e(t){v(this,e),this.app=h()(),this.contractServer=t,this.initExpressMiddleWare(),this.getInformation(),this.getFlights()}var t,n,r;return t=e,(n=[{key:"initExpressMiddleWare",value:function(){this.app.use(m.urlencoded({extended:!0})),this.app.use(m.json()),this.app.use(b())}},{key:"getFlights",value:function(){var e=this;this.app.get("/flights",function(){var t=d(regeneratorRuntime.mark(function t(n,r){return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.contractServer.getRegisteredFlights();case 2:r.json({flightsForPurchase:e.contractServer.flightsForPurchase,flightsLanded:e.contractServer.flightsLanded});case 3:case"end":return t.stop()}},t)}));return function(e,n){return t.apply(this,arguments)}}())}},{key:"getInformation",value:function(){this.app.get("/",function(e,t){t.json({endpoints:[{"/":{method:"GET",description:"An API for use with your Dapp"},"/flights":{method:"GET",description:"List of flights"}}]})})}}])&&f(t.prototype,n),r&&f(t,r),e}(),O=new function t(){var n=this;v(this,t),x(this,"init",d(regeneratorRuntime.mark(function e(){var t,r,s,a;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return F.setProvider(y.currentProvider),k.setProvider(y.currentProvider),e.prev=2,e.next=5,F.deployed();case 5:return t=e.sent,e.next=8,k.deployed();case 8:return r=e.sent,s=t.address,e.next=12,w;case 12:return a=e.sent,e.next=15,r.authorizeCaller(s,{from:a[0]});case 15:e.next=22;break;case 17:e.prev=17,e.t0=e.catch(2),console.log(e.t0.toString()),console.error("Check if Ganache is running and contracts deployed properly!"),process.exit();case 22:n.registerOracles(),n.listenEvents(),n.getRegisteredFlights();case 25:case"end":return e.stop()}},e,null,[[2,17]])}))),x(this,"registerOracles",d(regeneratorRuntime.mark(function e(){var t,r,s,a,o,c;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,F.deployed();case 2:return t=e.sent,r=n,e.next=6,t.REGISTRATION_FEE().call();case 6:return s=e.sent,e.next=9,w;case 9:a=e.sent,o=R.numOracles<a.length?R.numOracles:a.length-1,c=1;case 12:if(!(c<o)){e.next=25;break}return e.prev=13,r.oracles.push(a[c]),e.next=17,t.registerOracle({from:a[c],value:s,gas:3e6});case 17:e.next=22;break;case 19:e.prev=19,e.t0=e.catch(13),console.log(e.t0.toString());case 22:c++,e.next=12;break;case 25:case"end":return e.stop()}},e,null,[[13,19]])}))),x(this,"submitOracleResponse",(r=d(regeneratorRuntime.mark(function e(t,r,s){var a,o,c,i,l;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,F.deployed();case 2:a=e.sent,o=0;case 4:if(!(o<n.oracles.length)){e.next=31;break}return c=n.status[Math.floor(Math.random()*n.status.length)],e.prev=6,e.next=9,a.getMyIndexes({from:n.oracles[o]});case 9:i=e.sent,l=0;case 11:if(!(l<i.length)){e.next=23;break}return e.prev=12,e.next=15,a.submitOracleResponse(i[l],t,r,s,c,{from:n.oracles[o],gas:3e6});case 15:e.next=20;break;case 17:e.prev=17,e.t0=e.catch(12),console.log(e.t0.toString());case 20:l++,e.next=11;break;case 23:e.next=28;break;case 25:e.prev=25,e.t1=e.catch(6),console.log(e.t1);case 28:o++,e.next=4;break;case 31:case"end":return e.stop()}},e,null,[[6,25],[12,17]])})),function(e,t,n){return r.apply(this,arguments)})),x(this,"getRegisteredFlights",d(regeneratorRuntime.mark(function t(){var r,s,a,o,c,i;return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,k.deployed();case 2:return r=t.sent,s=n,t.next=6,r.getRegisteredFlights().call();case 6:a=t.sent,console.log(a+" registered flights"),s.flightsForPurchase=[],s.flightsLanded=[],o=0;case 11:if(!(o<parseInt(a))){t.next=29;break}return t.prev=12,t.next=15,r.getFlightKeyIndex(o).call();case 15:return c=t.sent,t.next=18,r.flights(c).call();case 18:(i=t.sent).flightKey=c,"0"===i.statusCode?s.flightsForPurchase.push(i):s.flightsLanded.push(i),t.next=26;break;case 23:t.prev=23,t.t0=t.catch(12),console.log(e);case 26:o++,t.next=11;break;case 29:case"end":return t.stop()}},t,null,[[12,23]])}))),x(this,"listenEvents",d(regeneratorRuntime.mark(function e(){var t,r;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t=n,e.next=3,F.deployed();case 3:return r=e.sent,e.next=6,k.deployed();case 6:e.sent,r.events.OracleReport({},function(e,t){e&&console.log(e),console.log("OracleReport: /n"+t.returnValues+"/n-----------------------")}),r.events.OracleRequest({},function(){var e=d(regeneratorRuntime.mark(function e(n,r){var s,a,o,c;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n&&console.log(n),console.log("OracleRequest: /n"+r.returnValues+"/n-----------------------"),s=r.returnValues,a=s.airline,o=s.flight,c=s.timestamp,e.next=5,t.submitOracleResponse(a,o,c);case 5:case"end":return e.stop()}},e)}));return function(t,n){return e.apply(this,arguments)}}()),r.events.FlightStatusInfo({},function(e,t){e&&console.log(e),console.log("FlightStatusInfo: /n"+t.returnValues+"/n-----------------------")}),k.events.AirlineFunded({},function(e,t){e&&console.log(e),console.log("AirlineFunded: /n"+t.returnValues+"/n-----------------------")}),k.events.FlightRegistered({},function(e,n){e&&console.log(e),console.log("FlightRegistered: /n"+n.returnValues+"/n-----------------------"),t.getRegisteredFlights()}),k.events.PassengerInsured({},function(e,t){e&&console.log(e),console.log("PassengerInsured: /n"+t.returnValues+"/n-----------------------")}),k.events.FlightStatusUpdated({},function(e,n){e&&console.log(e),console.log("FlightStatusUpdated: /n"+n.returnValues+"/n-----------------------"),t.getRegisteredFlights()}),k.events.AccountWithdrawal({},function(e,t){e&&console.log(e),console.log("AccountWithdrawal: /n"+t.returnValues+"/n-----------------------")});case 15:case"end":return e.stop()}},e)}))),this.flightsForPurchase=[],this.flightsLanded=[],this.oracles=[],this.status=[20,30,40,50,0];var r};O.init();var S=new P(O);n.default=S}};