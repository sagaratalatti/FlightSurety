exports.id=0,exports.modules={"./src/server/server.js":function(t,n,r){"use strict";r.r(n);var s=r("./build/contracts/FlightSuretyApp.json"),a=r("./build/contracts/FlightSuretyData.json"),o=r("./src/server/config.json"),i=r("web3"),c=r.n(i),u=r("express"),l=r.n(u);function h(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function g(e,t,n,r,s,a,o){try{var i=e[a](o),c=i.value}catch(e){return void n(e)}i.done?t(c):Promise.resolve(c).then(r,s)}function f(e){return function(){var t=this,n=arguments;return new Promise(function(r,s){var a=e.apply(t,n);function o(e){g(a,r,s,o,i,"next",e)}function i(e){g(a,r,s,o,i,"throw",e)}o(void 0)})}}function d(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function p(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var v=r("body-parser"),m=r("cors"),x=o.localhost,b=new c.a(new c.a.providers.WebsocketProvider(x.url.replace("http","ws"))),w=b.eth.getAccounts();b.eth.defaultAccount="0x55690752ed06B1d37510D20B3516b2D12F007f6d";var R=new b.eth.Contract(s.abi,x.appAddress),k=new b.eth.Contract(a.abi,x.dataAddress),F=function(){function e(t){d(this,e),this.app=l()(),this.contractServer=t,this.initExpressMiddleWare(),this.getInformation(),this.getFlights()}var t,n,r;return t=e,(n=[{key:"initExpressMiddleWare",value:function(){this.app.use(v.urlencoded({extended:!0})),this.app.use(v.json()),this.app.use(m())}},{key:"getFlights",value:function(){var e=this;this.app.get("/flights",function(){var t=f(regeneratorRuntime.mark(function t(n,r){return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.contractServer.getRegisteredFlights();case 2:r.json({flightsForPurchase:e.contractServer.flightsForPurchase,flightsLanded:e.contractServer.flightsLanded});case 3:case"end":return t.stop()}},t)}));return function(e,n){return t.apply(this,arguments)}}())}},{key:"getInformation",value:function(){this.app.get("/",function(e,t){t.json({endpoints:[{"/":{method:"GET",description:"An API for use with your Dapp"},"/flights":{method:"GET",description:"List of flights"}}]})})}}])&&h(t.prototype,n),r&&h(t,r),e}(),y=new function t(){var n=this;d(this,t),p(this,"init",f(regeneratorRuntime.mark(function e(){var t,r;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,t=R.address,e.next=4,w;case 4:return r=e.sent,e.next=7,k.methods.authorizeCaller(t).send({from:r[0]});case 7:e.next=14;break;case 9:e.prev=9,e.t0=e.catch(0),console.log(e.t0.toString()),console.error("Check if Ganache is running and contracts deployed properly!"),process.exit();case 14:n.registerOracles(),n.listenEvents(),n.getRegisteredFlights();case 17:case"end":return e.stop()}},e,null,[[0,9]])}))),p(this,"registerOracles",f(regeneratorRuntime.mark(function e(){var t,r,s,a,o;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t=n,e.next=3,R.methods.REGISTRATION_FEE().call();case 3:return r=e.sent,e.next=6,w;case 6:s=e.sent,a=x.numOracles<s.length?x.numOracles:s.length-1,o=1;case 9:if(!(o<a)){e.next=22;break}return e.prev=10,t.oracles.push(s[o]),e.next=14,R.methods.registerOracle().send({from:s[o],value:r,gas:3e6});case 14:e.next=19;break;case 16:e.prev=16,e.t0=e.catch(10),console.log(e.t0.toString());case 19:o++,e.next=9;break;case 22:case"end":return e.stop()}},e,null,[[10,16]])}))),p(this,"submitOracleResponse",(r=f(regeneratorRuntime.mark(function e(t,r,s){var a,o,i,c;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:a=0;case 1:if(!(a<n.oracles.length)){e.next=28;break}return o=n.status[Math.floor(Math.random()*n.status.length)],e.prev=3,e.next=6,R.methods.getMyIndexes().call({from:n.oracles[a]});case 6:i=e.sent,c=0;case 8:if(!(c<i.length)){e.next=20;break}return e.prev=9,e.next=12,R.methods.submitOracleResponse(i[c],t,r,s,o).send({from:n.oracles[a],gas:3e6});case 12:e.next=17;break;case 14:e.prev=14,e.t0=e.catch(9),console.log(e.t0.toString());case 17:c++,e.next=8;break;case 20:e.next=25;break;case 22:e.prev=22,e.t1=e.catch(3),console.log(e.t1);case 25:a++,e.next=1;break;case 28:case"end":return e.stop()}},e,null,[[3,22],[9,14]])})),function(e,t,n){return r.apply(this,arguments)})),p(this,"getRegisteredFlights",f(regeneratorRuntime.mark(function t(){var r,s,a,o,i;return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return r=n,t.next=3,k.methods.getRegisteredFlights().call();case 3:s=t.sent,console.log(s+"registered flights"),r.flightsForPurchase=[],r.flightsLanded=[],a=0;case 8:if(!(a<parseInt(s))){t.next=26;break}return t.prev=9,t.next=12,k.methods.getFlightKeyIndex(a).call();case 12:return o=t.sent,t.next=15,k.methods.flights(o).call();case 15:(i=t.sent).flightKey=o,"0"===i.statusCode?r.flightsForPurchase.push(i):r.flightsLanded.push(i),t.next=23;break;case 20:t.prev=20,t.t0=t.catch(9),console.log(e);case 23:a++,t.next=8;break;case 26:case"end":return t.stop()}},t,null,[[9,20]])}))),p(this,"listenEvents",f(regeneratorRuntime.mark(function e(){var t;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:t=n,R.events.OracleReport({},function(e,t){e&&console.log(e),console.log("OracleReport: /n"+t.returnValues+"/n-----------------------")}),R.events.OracleRequest({},function(){var e=f(regeneratorRuntime.mark(function e(n,r){var s,a,o,i;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n&&console.log(n),console.log("OracleRequest: /n"+r.returnValues+"/n-----------------------"),s=r.returnValues,a=s.airline,o=s.flight,i=s.timestamp,e.next=5,t.submitOracleResponse(a,o,i);case 5:case"end":return e.stop()}},e)}));return function(t,n){return e.apply(this,arguments)}}()),R.events.FlightStatusInfo({},function(e,t){e&&console.log(e),console.log("FlightStatusInfo: /n"+t.returnValues+"/n-----------------------")}),k.events.AirlineFunded({},function(e,t){e&&console.log(e),console.log("AirlineFunded: /n"+t.returnValues+"/n-----------------------")}),k.events.FlightRegistered({},function(e,n){e&&console.log(e),console.log("FlightRegistered: /n"+n.returnValues+"/n-----------------------"),t.getRegisteredFlights()}),k.events.PassengerInsured({},function(e,t){e&&console.log(e),console.log("PassengerInsured: /n"+t.returnValues+"/n-----------------------")}),k.events.FlightStatusUpdated({},function(e,n){e&&console.log(e),console.log("FlightStatusUpdated: /n"+n.returnValues+"/n-----------------------"),t.getRegisteredFlights()}),k.events.AccountWithdrawal({},function(e,t){e&&console.log(e),console.log("AccountWithdrawal: /n"+t.returnValues+"/n-----------------------")});case 9:case"end":return e.stop()}},e)}))),this.flightsForPurchase=[],this.flightsLanded=[],this.oracles=[],this.status=[20,30,40,50,0];var r};y.init();var O=new F(y);n.default=O}};