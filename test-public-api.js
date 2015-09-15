var BTCE = require('./btc-e.js'),
    btcePublic = new BTCE();


console.log("Test Info Method");
btcePublic.info(function(err, data) {
    console.log(err, data);
});

/*
btcePublic.ticker("btc_usd", function(err, data) {
    console.log("Test Ticker Method");
    console.log(err, data);
});


btcePublic.depth("btc_usd", function(err, data) {
    console.log("Test Depth Method");
    console.log(err, data);
});


btcePublic.trades("btc_usd", function(err, data) {
    console.log("Test Trades Method");
    console.log(err, data);
});
*/