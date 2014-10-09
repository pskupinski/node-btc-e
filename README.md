node-btc-e
=====

An unoffocial node.js client for the [btc-e trade api](https://btc-e.com/api/documentation) including public api methods(info, ticker, depth, and trades).

## Installation

node-btc-e is available as `btc-e` on npm.

```
npm install btc-e
```

## Usage

```javascript
var BTCE = require('btc-e'),
    btceTrade = new BTCE("YourApiKey", "YourSecret"),
    // No need to provide keys if you're only using the public api methods.
    btcePublic = new BTCE();

// Public API method call example 1.
// Note: Could use "btceTrade" here as well.
btcePublic.ticket("ltc_btc", function(err, data) {
  console.log(err, data);
});

// Public API method call example 2.
// Note: Optional integer field added as a third parameter in API v3
btcePublic.depth("btc_usd", function(err, data) {
  console.log(err, data);
}, 3);

// Trade API method call.
btceTrade.getInfo(function(err, info) {
  console.log(err, info);
});
```

## Options

The constructor supports an optional third parameter for passing in various options to override defaults, which can either be a hash of the overrides or a nonce generation function if that is the only override required.

When passed as a hash, the following options are supported:
* agent - The HTTPS agent to use when making requests
* timeout - The timeout to use when making requests, defaults to 5 seconds
* nonce - A nonce generation function ([Custom nonce generation](#custom-nonce-generation))
* tapi_url - The base url to use when making trade api requests, defaults to `https://btc-e.com/tapi`
* public_url - The base url to use when making public api requests, defaults to `https://btc-e.com/api/2/`

```javascript
var BTCE = require('btc-e'),
    HttpsAgent = require('agentkeepalive').HttpsAgent,
    btceTrade = new BTCE("YourApiKey", "YourSecret", {
      agent: new HttpsAgent()
    });
```

## Custom nonce generation

By default the module generates a nonce based on the current timestamp in seconds(can't use anything smaller than seconds since btc-e is capped at 4294967294 for nonces) as a means of providing a consistently increasing number, but for traders who want to possibly get in more than one trade api request per second per api key there is a way to do so by providing a nonce generation function as the `nonce` option in an options hash provided as the third parameter to the constructor.  Please don't abuse the service btc-e is providing though.

btc-e expects every nonce given to be greater than the previous one for each api key you have, this presents a big problem when trying to do multiple async calls with the same api key since there is no guarantee that the first api call will be processed before the second one and so on.  Chaining calls synchronously(take a look at promises with [q.js](https://github.com/kriskowal/q) for help with that) or using multiple clients, each with their own API key are the only way around that problem.

```javascript
var BTCE = require('btc-e'),
    fs = require('fs'),
    currentNonce = fs.existsSync("nonce.json") ? JSON.parse(fs.readFileSync("nonce.json")) : 0,
    // Provide a nonce generation function as the third parameter if desired.
    // The function must provide a number that is larger than the one before and must not
    // be larger than the 32-bit unsigned integer max value of 4294967294.
    btce = new BTCE("YourApiKey", "YourSecret", {
      nonce: function() {
        currentNonce++;
        fs.writeFile("nonce.json", currentNonce);
        return currentNonce;
      }
    });

btce.getInfo(function(err, info) {
  console.log(err, info);
});
```

## Reference

A method-by-method [reference](https://github.com/pskupinski/node-btc-e/wiki/API-Reference) is available on the wiki.

## License

This module is [ISC licensed](https://github.com/pskupinski/node-btc-e/blob/master/LICENSE.txt).
