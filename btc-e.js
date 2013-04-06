var request = require("request"),
    crypto = require("crypto"),
    querystring = require("querystring");

var BTCE = function(apiKey, secret) {
  var self = this;
  self.url = "https://btc-e.com/tapi";
  self.apiKey = apiKey;
  self.secret = secret;

  self.makeRequest = function(method, params, callback) {
    var queryString,
        sign,
        headers;

    params.nonce = Math.round((new Date()).getTime()/1000);
    params.method = method;
    queryString = querystring.stringify(params);

    sign = crypto.createHmac("sha512", self.secret).update(new Buffer(queryString)).digest('hex').toString();
    headers = {
      'Sign': sign,
      'Key': self.apiKey
    };

    request({ url: self.url, method: "POST", form: params, headers: headers }, function(err, response, body) {
      var result = JSON.parse(body);
      if(err || result.success === 0) {
        callback(result.error);
        return;
      }

      callback(false, result['return']);
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
};

module.exports = BTCE;
