node-btc-e
=====

An unoffocial node.js client for the [btc-e trade api](https://btc-e.com/api/documentation) including public api methods(ticker, trades, depth).

## Usage

```javascript
var BTCE = require('btc-e'),
    btceTrade = new BTCE("YourApiKey", "YourSecret"),
    // No need to provide keys if you're only using the public api methods.
    btcePublic = new BTCE();

// Public API method call.
// Note: Could use "btceTrade" here as well.
btcePublic.ticker("ltc_btc", function(err, data) {
    if (err) {
      throw err;
    }

    console.log(data);
});

// Trade API method call.
btceTrade.getInfo(function(err, info) {
  if (err) {
    throw err;
  }

  console.log(info);
});
```

## Reference

A method-by-method [reference](https://github.com/scud43/node-btc-e/wiki/API-Reference) is available on the wiki.

## License

This module is [ISC licensed](https://github.com/scud43/node-btc-e/blob/master/LICENSE.txt).
