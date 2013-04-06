btc-e
=====

An unoffocial node.js client for the [btc-e trade api](https://btc-e.com/api/documentation) including public api methods(ticker, trades, depth).

## Usage

```javascript
var BTCE = require('btc-e'),
    btce = new BTCE("YourApiKey", "YourSecret");

btce.getInfo(function(err, info) {
  if (err) {
    throw err;
  }

  console.log(info);
});

btce.ticker("ltc_btc", function(err, data) {
    if (err) {
      throw err;
    }

    console.log(data);
});
```

## License

This module is [ISC licensed](https://github.com/scud43/btc-e/blob/master/LICENSE.txt).
