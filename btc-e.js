var request = require("request"),
    crypto = require("crypto"),
    querystring = require("querystring");

var BTCE = function(apiKey, secret, nonceGenerator) {
  this.url = "https://btc-e.com/tapi";
  this.publicApiUrl = "https://btc-e.com/api/2/";
  this.apiKey = apiKey;
  this.secret = secret;
  this.nonce = nonceGenerator;
};

BTCE.prototype.makeRequest = function(method, params, callback) {
  var queryString,
      sign,
      headers,
      self = this;

  if(!self.apiKey || !self.secret) {
    callback(new Error("Must provide API key and secret to use the trade API."));
    return;
  }

  // If the user provided a function for generating the nonce, then use it.
  if(self.nonce) {
    params.nonce = self.nonce();
  } else {
    params.nonce = Math.round((new Date()).getTime() / 1000);
  }

  params.method = method;
  queryString = querystring.stringify(params);

  sign = crypto.createHmac("sha512", self.secret).update(new Buffer(queryString)).digest('hex').toString();
  headers = {
    'Sign': sign,
    'Key': self.apiKey
  };

  request({ url: self.url, method: "POST", form: params, headers: headers, timeout: 5000, strictSSL: false }, function(err, response, body) {
    if(err || response.statusCode !== 200) {
      return callback(new Error(err ? err : response.statusCode));
    }

    var result;
    try {
      result = JSON.parse(body);
    } catch(error) {
      return callback(new Error(error));
    }

    if(result.success === 0) {
      return callback(new Error(result.error));
    }

    callback(null, result['return']);
  });
};

BTCE.prototype.makePublicApiRequest = function(pair, method, callback) {
  var self = this;
  request({ url: self.publicApiUrl + pair + '/' + method, timeout: 5000, strictSSL: false }, function(err, response, body) {
    if(err || response.statusCode !== 200) {
      return callback(new Error(err ? err : response.statusCode));
    }

    var result;
    try {
      result = JSON.parse(body);
    } catch(error) {
      return callback(new Error(error));
    }

    if(result.error) {
      return callback(new Error(result.error));
    }

    callback(null, result);
  });
};

BTCE.prototype.getInfo = function(callback) {
  this.makeRequest('getInfo', {}, callback);
};

BTCE.prototype.transHistory = function(params, callback) {
  this.makeRequest('TransHistory', params, callback);
};

BTCE.prototype.tradeHistory = function(params, callback) {
  this.makeRequest('TradeHistory', params, callback);
};

BTCE.prototype.orderList = function(params, callback) {
  this.makeRequest('OrderList', params, callback);
};

BTCE.prototype.activeOrders = function(pair, callback) {
  if (!callback) {
    callback = pair;
    pair = null;
  }

  this.makeRequest('ActiveOrders', {pair: pair}, callback);
};

BTCE.prototype.trade = function(pair, type, rate, amount, callback) {
  this.makeRequest('Trade', {
    'pair': pair,
    'type': type,
    'rate': rate,
    'amount': amount
  }, callback);
};

BTCE.prototype.cancelOrder = function(orderId, callback) {
  this.makeRequest('CancelOrder', {'order_id': orderId}, callback);
};

BTCE.prototype.ticker = function(pair, callback) {
  this.makePublicApiRequest(pair, 'ticker', callback);
};

BTCE.prototype.trades = function(pair, callback) {
  this.makePublicApiRequest(pair, 'trades', callback);
};

BTCE.prototype.depth = function(pair, callback) {
  this.makePublicApiRequest(pair, 'depth', callback);
};

BTCE.prototype.fee = function(pair, callback) {
  this.makePublicApiRequest(pair, 'fee', callback);
};

module.exports = BTCE;
