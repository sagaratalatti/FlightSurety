exports.id=0,exports.modules={"./src/server/server.js":function(t,n,r){"use strict";r.r(n);r("@babel/polyfill");var s=r("./build/contracts/FlightSuretyApp.json"),o=r("./build/contracts/FlightSuretyData.json"),a=r("truffle-contract"),i=r.n(a),c=r("web3"),u=r.n(c),l=r("express"),g=r.n(l);function h(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function f(e,t,n,r,s,o,a){try{var i=e[o](a),c=i.value}catch(e){return void n(e)}i.done?t(c):Promise.resolve(c).then(r,s)}function p(e){return function(){var t=this,n=arguments;return new Promise(function(r,s){var o=e.apply(t,n);function a(e){f(o,r,s,a,i,"next",e)}function i(e){f(o,r,s,a,i,"throw",e)}a(void 0)})}}function d(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function v(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var x=r("body-parser"),m=r("cors"),b=new u.a(new u.a.providers.HttpProvider("http://localhost:7545")),R=b.eth.getAccounts();b.eth.defaultAccount="0x55690752ed06B1d37510D20B3516b2D12F007f6d";var y=i()(s),w=i()(o),F=function(){function e(t){d(this,e),this.app=g()(),this.contractServer=t,this.initExpressMiddleWare(),this.getInformation(),this.getFlights()}var t,n,r;return t=e,(n=[{key:"initExpressMiddleWare",value:function(){this.app.use(x.urlencoded({extended:!0})),this.app.use(x.json()),this.app.use(m())}},{key:"getFlights",value:function(){var e=this;this.app.get("/flights",function(){var t=p(regeneratorRuntime.mark(function t(n,r){return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.contractServer.getRegisteredFlights();case 2:r.json({flightsForPurchase:e.contractServer.flightsForPurchase,flightsLanded:e.contractServer.flightsLanded});case 3:case"end":return t.stop()}},t)}));return function(e,n){return t.apply(this,arguments)}}())}},{key:"getInformation",value:function(){this.app.get("/",function(e,t){t.json({endpoints:[{"/":{method:"GET",description:"An API for use with your Dapp"},"/flights":{method:"GET",description:"List of flights"}}]})})}}])&&h(t.prototype,n),r&&h(t,r),e}(),k=new function t(){var n=this;d(this,t),v(this,"init",p(regeneratorRuntime.mark(function e(){var t,r,s,o;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return y.setProvider(b.currentProvider),w.setProvider(b.currentProvider),e.prev=2,e.next=5,y.deployed();case 5:return t=e.sent,e.next=8,w.deployed();case 8:return r=e.sent,s=t.address,e.next=12,R;case 12:return o=e.sent,e.next=15,r.authorizeCaller(s,{from:o[0]});case 15:e.next=22;break;case 17:e.prev=17,e.t0=e.catch(2),console.log(e.t0.toString()),console.error("Check if Ganache is running and contracts deployed properly!"),process.exit();case 22:n.registerOracles(),n.listenEvents(),n.getRegisteredFlights();case 25:case"end":return e.stop()}},e,null,[[2,17]])}))),v(this,"registerOracles",p(regeneratorRuntime.mark(function e(){var t,r,s,o,a,i;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,y.deployed();case 2:return t=e.sent,r=n,e.next=6,t.REGISTRATION_FEE();case 6:return s=e.sent,e.next=9,R;case 9:o=e.sent,a=50<o.length?50:o.length-1,i=1;case 12:if(!(i<a)){e.next=25;break}return e.prev=13,r.oracles.push(o[i]),e.next=17,t.registerOracle({from:o[i],value:s,gas:3e6});case 17:e.next=22;break;case 19:e.prev=19,e.t0=e.catch(13),console.log(e.t0.toString());case 22:i++,e.next=12;break;case 25:case"end":return e.stop()}},e,null,[[13,19]])}))),v(this,"submitOracleResponse",(r=p(regeneratorRuntime.mark(function e(t,r,s){var o,a,i,c,u;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,y.deployed();case 2:o=e.sent,a=0;case 4:if(!(a<n.oracles.length)){e.next=31;break}return i=n.status[Math.floor(Math.random()*n.status.length)],e.prev=6,e.next=9,o.getMyIndexes({from:n.oracles[a]});case 9:c=e.sent,u=0;case 11:if(!(u<c.length)){e.next=23;break}return e.prev=12,e.next=15,o.submitOracleResponse(c[u],t,r,s,i,{from:n.oracles[a],gas:3e6});case 15:e.next=20;break;case 17:e.prev=17,e.t0=e.catch(12),console.log(e.t0.toString());case 20:u++,e.next=11;break;case 23:e.next=28;break;case 25:e.prev=25,e.t1=e.catch(6),console.log(e.t1);case 28:a++,e.next=4;break;case 31:case"end":return e.stop()}},e,null,[[6,25],[12,17]])})),function(e,t,n){return r.apply(this,arguments)})),v(this,"getRegisteredFlights",p(regeneratorRuntime.mark(function t(){var r,s,o,a,i,c;return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,w.deployed();case 2:return r=t.sent,s=n,t.next=6,r.getRegisteredFlights();case 6:o=t.sent,console.log(o+" registered flights"),s.flightsForPurchase=[],s.flightsLanded=[],a=0;case 11:if(!(a<parseInt(o))){t.next=29;break}return t.prev=12,t.next=15,r.getFlightKeyIndex(a);case 15:return i=t.sent,t.next=18,r.flights(i);case 18:(c=t.sent).flightKey=i,"0"===c.statusCode?s.flightsForPurchase.push(c):s.flightsLanded.push(c),t.next=26;break;case 23:t.prev=23,t.t0=t.catch(12),console.log(e);case 26:a++,t.next=11;break;case 29:case"end":return t.stop()}},t,null,[[12,23]])}))),v(this,"listenEvents",p(regeneratorRuntime.mark(function e(){var t,r,s;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t=n,e.next=3,y.deployed();case 3:return r=e.sent,e.next=6,w.deployed();case 6:s=e.sent,r.OracleReport({},function(e,t){e&&console.log(e),console.log("OracleReport: /n"+t.returnValues+"/n-----------------------")}),r.events.OracleRequest({},function(){var e=p(regeneratorRuntime.mark(function e(n,r){var s,o,a,i;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n&&console.log(n),console.log("OracleRequest: /n"+r.returnValues+"/n-----------------------"),s=r.returnValues,o=s.airline,a=s.flight,i=s.timestamp,e.next=5,t.submitOracleResponse(o,a,i);case 5:case"end":return e.stop()}},e)}));return function(t,n){return e.apply(this,arguments)}}()),r.events.FlightStatusInfo({},function(e,t){e&&console.log(e),console.log("FlightStatusInfo: /n"+t.returnValues+"/n-----------------------")}),s.events.AirlineFunded({},function(e,t){e&&console.log(e),console.log("AirlineFunded: /n"+t.returnValues+"/n-----------------------")}),s.events.FlightRegistered({},function(e,n){e&&console.log(e),console.log("FlightRegistered: /n"+n.returnValues+"/n-----------------------"),t.getRegisteredFlights()}),s.events.PassengerInsured({},function(e,t){e&&console.log(e),console.log("PassengerInsured: /n"+t.returnValues+"/n-----------------------")}),s.events.FlightStatusUpdated({},function(e,n){e&&console.log(e),console.log("FlightStatusUpdated: /n"+n.returnValues+"/n-----------------------"),t.getRegisteredFlights()}),s.events.AccountWithdrawal({},function(e,t){e&&console.log(e),console.log("AccountWithdrawal: /n"+t.returnValues+"/n-----------------------")});case 15:case"end":return e.stop()}},e)}))),this.flightsForPurchase=[],this.flightsLanded=[],this.oracles=[],this.status=[20,30,40,50,0];var r};k.init();var P=new F(k);n.default=P}};