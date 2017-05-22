'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const process = require('process');

var parambyname = require('decode-post-body-params');
var emptyStringCheck = require("fuckingundefinedemptynull").isStringSet;

var response = {
  statusCode: 400,
  body: "Implementation Not complete"
};

// https://www.coinpayments.net/merchant-tools-ipn
module.exports.receive = (event, context, callback) => {
  console.log("Dumping entire event");
  console.log(JSON.stringify(event.headers));

  console.log("Detecting request");
  if (event.httpMethod == "POST" || event.httpMethod == "PUT") {
    if (event.httpMethod == "POST") {
      if (emptyStringCheck(event.body) && event.headers !== undefined) {
        var headers_http_hmac = event.headers['HTTP_HMAC'];
        // Fields received
        var data_ipn_version = parambyname('ipn_version', "http://localhost/?" + event.body);
        var data_ipn_mode = parambyname('ipn_mode', "http://localhost/?" + event.body);
        var data_ipn_id =  parambyname('ipn_id', "http://localhost/?" + event.body);
        var data_merchant =  parambyname('merchant', "http://localhost/?" + event.body);
        var data_address = parambyname('address', "http://localhost/?" + event.body);
        var data_txn_id = parambyname('txn_id', "http://localhost/?" + event.body);
        var data_status = parambyname('status', "http://localhost/?" + event.body);
        var data_status_text = parambyname('status_text', "http://localhost/?" + event.body);
        var data_currency = parambyname('currency', "http://localhost/?" + event.body);
        var data_amount = parambyname('amount', "http://localhost/?" + event.body);
        var data_amounti = parambyname('amounti', "http://localhost/?" + event.body);
        var data_first_name = parambyname('first_name', "http://localhost/?" + event.body);
        var data_last_name = parambyname('last_name', "http://localhost/?" + event.body);
        var data_email = parambyname('email', "http://localhost/?" + event.body);
        if (emptyStringCheck(data_ipn_mode) && emptyStringCheck(data_ipn_version) && emptyStringCheck(data_ipn_id) && emptyStringCheck(data_merchant)) {
          if (data_ipn_mode == "hmac") {
            if (emptyStringCheck(headers_http_hmac)) {
              console.log("HMAC Mode request");
              console.log(headers_http_hmac);
              console.log("ipn_id: " + data_ipn_id + " merchant: " + data_merchant);
              if (emptyStringCheck(data_currency) && emptyStringCheck(data_amount)) console.log("Currency: " + data_currency.toString() + " Amount: " + data_amount.toString());
              if (emptyStringCheck(data_txn_id)) console.log("TXN ID: " + data_txn_id.toString());
              // TODO: Check HMAC
              response['statusCode'] = 200;
              response['body'] = JSON.stringify({
                message: "Received"
              });
            } else {
              response['statusCode'] = 401;
              response['body'] = JSON.stringify({
                message: "Invalid Authentication Headers"
              });
            }
          } else {
            response['statusCode'] = 401;
            response['body'] = JSON.stringify({
              message: "Invalid Authentication type"
            });
          }
        } else {
          response['statusCode'] = 400;
          response['body'] = JSON.stringify({
            message: "Missing the following parameters: ipn_mode, ipn_id, merchant, ipn_version"
          });
        }
      } else {
        response['body'] = JSON.stringify({
          message: "Empty POST body"
        });
      }
    } else {
      response['body'] = JSON.stringify({
        message: "Invalid Method"
      });
    }
  } else {
    console.log(JSON.stringify(event.queryStringParameters));
    response['statusCode'] = 200;
    response['body'] = JSON.stringify({
      action: event.httpMethod,
      status: 200,
      message: "Received"
    });
  }

  callback(null, response);
}
