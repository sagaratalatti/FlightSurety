exports.id=0,exports.modules={"./src/server/server.js":function(t,r,n){"use strict";n.r(r);n("@babel/polyfill");var s=n("./build/contracts/FlightSuretyApp.json"),a=n("./build/contracts/FlightSuretyData.json"),o=n("truffle-contract"),c=n.n(o),i=n("web3"),u=n.n(i),l=n("express"),h=n.n(l);function g(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function p(e,t,r,n,s,a,o){try{var c=e[a](o),i=c.value}catch(e){return void r(e)}c.done?t(i):Promise.resolve(i).then(n,s)}function f(e){return function(){var t=this,r=arguments;return new Promise(function(n,s){var a=e.apply(t,r);function o(e){p(a,n,s,o,c,"next",e)}function c(e){p(a,n,s,o,c,"throw",e)}o(void 0)})}}function d(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function v(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}var x=n("body-parser"),m=n("cors"),b=new u.a(new u.a.providers.HttpProvider("http://localhost:7545")),y=b.eth.getAccounts();b.eth.defaultAccount="0x55690752ed06B1d37510D20B3516b2D12F007f6d";var w=c()(s),k=c()(a),R=function(){function e(t){d(this,e),this.app=h()(),this.contractServer=t,this.initExpressMiddleWare(),this.getInformation(),this.getFlights()}var t,r,n;return t=e,(r=[{key:"initExpressMiddleWare",value:function(){this.app.use(x.urlencoded({extended:!0})),this.app.use(x.json()),this.app.use(m())}},{key:"getFlights",value:function(){var e=this;this.app.get("/flights",function(){var t=f(regeneratorRuntime.mark(function t(r,n){return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.contractServer.getRegisteredFlights();case 2:n.json({flightsForPurchase:e.contractServer.flightsForPurchase,flightsLanded:e.contractServer.flightsLanded});case 3:case"end":return t.stop()}},t)}));return function(e,r){return t.apply(this,arguments)}}())}},{key:"getInformation",value:function(){this.app.get("/",function(e,t){t.json({endpoints:[{"/":{method:"GET",description:"An API for use with your Dapp"},"/flights":{method:"GET",description:"List of flights"}}]})})}}])&&g(t.prototype,r),n&&g(t,n),e}(),F=new function t(){var r=this;d(this,t),v(this,"init",f(regeneratorRuntime.mark(function e(){var t,n,s,a;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return w.setProvider(b.currentProvider),k.setProvider(b.currentProvider),e.prev=2,e.next=5,w.deployed();case 5:return t=e.sent,e.next=8,k.deployed();case 8:return n=e.sent,s=t.address,e.next=12,y;case 12:return a=e.sent,e.next=15,n.authorizeCaller(s,{from:a[0]});case 15:console.log(a[0]),e.next=23;break;case 18:e.prev=18,e.t0=e.catch(2),console.log(e.t0.toString()),console.error("Check if Ganache is running and contracts deployed properly!"),process.exit();case 23:r.registerOracles(),r.getRegisteredFlights(),r.watchEvents();case 26:case"end":return e.stop()}},e,null,[[2,18]])}))),v(this,"registerOracles",f(regeneratorRuntime.mark(function e(){var t,n,s,a,o,c;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,w.deployed();case 2:return t=e.sent,n=r,e.next=6,t.REGISTRATION_FEE();case 6:return s=e.sent,e.next=9,y;case 9:a=e.sent,o=50<a.length?50:a.length-1,c=1;case 12:if(!(c<o)){e.next=25;break}return e.prev=13,n.oracles.push(a[c]),e.next=17,t.registerOracle({from:a[c],value:s,gas:3e6});case 17:e.next=22;break;case 19:e.prev=19,e.t0=e.catch(13),console.log(e.t0.toString());case 22:c++,e.next=12;break;case 25:case"end":return e.stop()}},e,null,[[13,19]])}))),v(this,"submitOracleResponse",(n=f(regeneratorRuntime.mark(function e(t,n,s){var a,o,c,i,u;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,w.deployed();case 2:a=e.sent,o=0;case 4:if(!(o<r.oracles.length)){e.next=32;break}return c=r.status[Math.floor(Math.random()*r.status.length)],console.log("random statusCode: "+c),e.prev=7,e.next=10,a.getMyIndexes({from:r.oracles[o]});case 10:i=e.sent,u=0;case 12:if(!(u<i.length)){e.next=24;break}return e.prev=13,e.next=16,a.submitOracleResponse(i[u],t,n,s,c,{from:r.oracles[o],gas:3e6});case 16:e.next=21;break;case 18:e.prev=18,e.t0=e.catch(13),console.log(e.t0.toString());case 21:u++,e.next=12;break;case 24:e.next=29;break;case 26:e.prev=26,e.t1=e.catch(7),console.log(e.t1);case 29:o++,e.next=4;break;case 32:case"end":return e.stop()}},e,null,[[7,26],[13,18]])})),function(e,t,r){return n.apply(this,arguments)})),v(this,"getRegisteredFlights",f(regeneratorRuntime.mark(function t(){var n,s,a,o,c,i;return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,k.deployed();case 2:return n=t.sent,s=r,t.next=6,n.getRegisteredFlights();case 6:a=t.sent,console.log(a+" registered flights"),s.flightsForPurchase=[],s.flightsLanded=[],o=0;case 11:if(!(o<parseInt(a))){t.next=30;break}return t.prev=12,t.next=15,n.getFlightKeyIndex(o);case 15:return c=t.sent,t.next=18,n.flights(c);case 18:(i=t.sent).flightKey=c,console.log("Status Code from COntract: "+i.statusCode),"0"===i.statusCode?(console.log("Flights for Purchase: "),s.flightsForPurchase.push(i)):(console.log("Flights Landed: "),s.flightsLanded.push(i)),t.next=27;break;case 24:t.prev=24,t.t0=t.catch(12),console.log(e);case 27:o++,t.next=11;break;case 30:case"end":return t.stop()}},t,null,[[12,24]])}))),v(this,"watchEvents",f(regeneratorRuntime.mark(function e(){var t;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,w.deployed();case 2:return t=e.sent,e.next=5,k.deployed();case 5:return e.sent,e.next=8,t.OracleReport();case 8:e.sent,report.watch(function(e,t){e?console.log(e):(console.log("OracleReport:"),console.log(t.returnValues))});case 10:case"end":return e.stop()}},e)}))),this.flightsForPurchase=[],this.flightsLanded=[],this.oracles=[],this.status=[10,20,30,40,50,0];var n};F.init();var P=new R(F);r.default=P}};