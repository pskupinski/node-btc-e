var request = require("request"),
    crypto = require("crypto"),
    querystring = require("querystring");

var BTCE = function(apiKey, secret, nonceGenerator) {
  var self = this;
  self.url = "https://btc-e.com/tapi";
  self.publicApiUrl = "https://btc-e.com/api/2/";
  self.apiKey = apiKey;
  self.secret = secret;
  self.nonce = nonceGenerator;

  self.makeRequest = function(method, params, callback) {
    var queryString,
        sign,
        headers;

    if(!self.apiKey || !self.secret) {
      callback(new Error("Must provide API key and secret to use the trade API."));
      return;
    }

    if (typeof self.nonceLast === 'undefined') self.nonceLast = Math.ceil((new Date()).getTime() / 1000);
    self.nonceLast++;
    
    // If the user provided a function for generating the nonce, then use it.
    if(self.nonce) {
      params.nonce = self.nonce();
    } else {
      params.nonce = self.nonceLast;
    }

    params.method = method;
    queryString = querystring.stringify(params);

    sign = crypto.createHmac("sha512", self.secret).update(new Buffer(queryString)).digest('hex').toString();
    headers = {
      'Sign': sign,
      'Key': self.apiKey
    };

    request({ url: self.url, method: "POST", form: params, headers: headers }, function(err, response, body) {
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

  self.makePublicApiRequest = function(pair, method, callback) {
    request({ url: self.publicApiUrl + pair + '/' + method }, function(err, response, body) {
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

  self.getInfo = function(callback) {
    self.makeRequest('getInfo', {}, callback);
  };

  self.transHistory = function(params, callback) {
    self.makeRequest('TransHistory', params, callback);
  };

  self.tradeHistory = function(params, callback) {
    self.makeRequest('TradeHistory', params, callback);
  };

  self.orderList = function(params, callback) {
    self.makeRequest('OrderList', params, callback);
  };

  self.activeOrders = function(pair, callback) {
    if (!callback) {
      callback = pair;
      pair = null;
    }

    self.makeRequest('ActiveOrders', {pair: pair}, callback);
  };

  self.trade = function(pair, type, rate, amount, callback) {
    self.makeRequest('Trade', {
      'pair': pair,
      'type': type,
      'rate': rate,
      'amount': amount
    }, callback);
  };

  self.cancelOrder = function(orderId, callback) {
    self.makeRequest('CancelOrder', {'order_id': orderId}, callback);
  };

  self.ticker = function(pair, callback) {
    self.makePublicApiRequest(pair, 'ticker', callback);
  };

  self.trades = function(pair, callback) {
    self.makePublicApiRequest(pair, 'trades', callback);
  };

  self.depth = function(pair, callback) {
    self.makePublicApiRequest(pair, 'depth', callback);
  };

  self.fee = function(pair, callback) {
    self.makePublicApiRequest(pair, 'fee', callback);
  };
};

module.exports = BTCE;
