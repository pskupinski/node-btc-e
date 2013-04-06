btc-e
=====

An unoffocial node.js client for the [btc-e trade api](https://btc-e.com/api/documentation) including public api methods(ticker, trades, depth).

## Usage

```javascript
var BTCE = require('btc-e'),
    btce = new BTCE("YourApiKey", "YourSecret");

// Trade API method call.
btce.getInfo(function(err, info) {
  if (err) {
    throw err;
  }

  console.log(info);
});

// Public API method call.
btce.ticker("ltc_btc", function(err, data) {
    if (err) {
      throw err;
    }

    console.log(data);
});
```

## Reference

A method-by-method [reference](https://github.com/scud43/btc-e/wiki/API-Reference) is available on the wiki.

## License

This module is [ISC licensed](https://github.com/scud43/btc-e/blob/master/LICENSE.txt).
