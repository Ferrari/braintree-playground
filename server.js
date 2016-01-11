'use strict';

const braintree = require('braintree');
let gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: 'qdwtg6k3qt9pcm25',
  publicKey: '8ffvg88cc5q2rdq3',
  privateKey: '7e39c7096d7b273fa380b3651cd1be36'
});

const express = require('express');
let app = express();

const bodyParser = require('body-parser')
const PORT = 5566;

app.use('/', express.static('client'));

app.get('/client_token', function(req, res, next) {
  gateway.clientToken.generate({}, function(err, resp){
    res.send(resp.clientToken);
    next()
  });
});

app.post('/checkout', bodyParser.urlencoded({extended:true}), function(req, res, next) {
  let nonce = req.body.payment_method_nonce;
  gateway.transaction.sale({
    amount: '10.00',
    paymentMethodNonce: nonce,
    customFields: {
      productMetadata: 'testfield',
    },
    options: {
      submitForSettlement: true
    },
    customer: {
      firstName: 'Rocker',
      email: 'test@example.com'
    }
  }, function(err, result){
    if (result) {
      if (result.success) {
        console.log(result);
        res.status(200).jsonp(result);
      } else {
        console.log(result.message);
        res.status(500).jsonp(result.message);
      }
    } else {
      console.log(err);
      res.status(500).jsonp(err);
    }
    next();
  })
})

app.listen(PORT, function() {
  console.log(`Server start on port: ${PORT}`);
});
