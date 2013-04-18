var request = require("request"),
    crypto = require("crypto"),
    querystring = require("querystring");

var BTCE = function(apiKey, secret) {
  var self = this;
  var nw_nonce = 1;
  self.url = "https://btc-e.com/tapi";
  self.publicApiUrl = "https://btc-e.com/api/2/";
  self.apiKey = apiKey;
  self.secret = secret;
  var started = false;

  self.setUpNonce = function() {
      self.makeRequest('getInfo', {}, function(err, data) {
		 if(!err)
			console.log('Nonce OK...');
		 else
		 {
			 var answer = err;
			 if(answer.indexOf("invalid nonce parameter") != -1) {
				 answer = answer.trim();
				 arr = answer.split(' ');
				 var last_nonce = arr[3].trim();
				 nw_nonce = Number(last_nonce) + 1;
				 console.log('Nonce set up ('+nw_nonce+')');
			 }
			 else
				console.log("Nonce NOT OK!");
		 }
	  });
  }

  self.makeRequest = function(method, params, callback) {
    var queryString,
        sign,
        headers;

    if(!self.apiKey || !self.secret) {
      throw "Must provide API key and secret to use the trade API.";
    }
    params.nonce = nw_nonce;
    //console.log("Params.nonce: "+params.nonce);
    nw_nonce++;
    params.method = method;
    queryString = querystring.stringify(params);
    sign = crypto.createHmac("sha512", self.secret).update(new Buffer(queryString)).digest('hex').toString();
    headers = {
      'Sign': sign,
      'Key': self.apiKey
    };

    request({ url: self.url, method: "POST", form: params, headers: headers }, function(err, response, body) {
      if(err || response.statusCode !== 200) {
        callback(err ? err : response.statusCode);
        return;
      }

      var result = JSON.parse(body);
      if(result.success === 0) {
        callback(result.error);
        return;
      }

      callback(false, result['return']);
    });
  };

  self.makePublicApiRequest = function(pair, method, callback) {
    request({ url: self.publicApiUrl + pair + '/' + method }, function(err, response, body) {
      if(err || response.statusCode !== 200) {
        callback(err ? err : response.statusCode);
        return;
      }

      var result = JSON.parse(body);

      if (result.error) {
        callback(result.error);
        return;
      }

      callback(false, result);
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

  self.ticker = function(pair, callback) {
    self.makePublicApiRequest(pair, 'ticker', callback);
  };

  self.trades = function(pair, callback) {
    self.makePublicApiRequest(pair, 'trades', callback);
  };

  self.depth = function(pair, callback) {
    self.makePublicApiRequest(pair, 'depth', callback);
  };

};

module.exports = BTCE;
