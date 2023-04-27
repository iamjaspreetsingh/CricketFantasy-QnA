const config = require('./config')
const https = require('https');
var express = require('express');
var app = express();
app.use(express.static(__dirname + '/flags'));
var bodyParser = require('body-parser');
var cors = require('cors');
var Web3 = require('web3');
var web3 = new Web3('https://matic-mumbai.chainstacklabs.com');

var ContractABI = config.ABI
var ContractAddress = '0x653316e3710c9117A68e5cb996a83Aa3874aC929'//'0x9C49FF69b1e6Abcc2c6b3ceA544f402e9E4c1952'//'0xcec34Fc02dF30Bf294Af22EdfD9667F2307Ad979'//'0x0A43be2ba9560d9d5e8c8C7144D2E5c6342Bdd2C'
var ContractInstance = new web3.eth.Contract(ContractABI, ContractAddress);

app.use(cors());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded

// get admin, contract deployer
app.get('/admin', function (req, res) {
  ContractInstance.methods.manager().call({ from: config.from }, function (error, result) {
    if (!error)
      res.send(result);
    else
      console.log(error);
  })
});

app.get('/getWinners/:_qid', function (req, res) {
  ContractInstance.methods.getWinners(req.params._qid).call({ from: config.from }, function (err, result) {
    if (!err)
      res.send(result);
    else
      console.log(err);
  })
});

app.get('/getWinnersnam/:_qid', function (req, res) {
  ContractInstance.methods.getWinnerNames(req.params._qid).call({ from: config.from }, function (err, result) {
    if (!err)
      res.send(result);
    else {
      res.send(err)
      console.log(err);
    }
  })
});

app.get('/getQ/:_qid', function (req, res) {
  ContractInstance.methods.getQcontent(req.params._qid).call({ from: config.from }, function (err, result) {
    if (!err)
      res.send(result);
    else
      console.log(err);
  })
});

app.get('/getWinnersAnsReason/:_qid', function (req, res) {
  ContractInstance.methods.getWinnersAnsReason(req.params._qid).call({ from: config.from }, function (err, result) {
    if (!err)
      res.send(result);
    else
      console.log(err);
  })
});

app.get('/getWinnersDist/:_qid', function (req, res) {
  ContractInstance.methods.getWinnersDist(req.params._qid).call({ from: config.from }, function (err, result) {
    if (!err)
      res.send(result);
    else
      console.log(err);
  })
});

app.get('/getWinnersno/:_qid', function (req, res) {
  ContractInstance.methods.getWinnersno(req.params._qid).call({ from: config.from }, function (err, result) {
    if (!err)
      res.send(result);
    else
      console.log(err);
  })
});

app.get('/getWinnersName/:_qid', function (req, res) {
  ContractInstance.methods.getWinnersName(req.params._qid).call({ from: config.from }, function (err, result) {
    if (!err)
      res.send(result);
    else
      console.log(err);
  })
});

app.get('/getWinnersAnsStr/:_qid', function (req, res) {
  ContractInstance.methods.getWinnersAnsStr(req.params._qid).call({ from: config.from }, function (err, result) {
    if (!err)
      res.send(result);
    else
      console.log(err);
  })
});


app.get('/getAns', function (req, res) {
  ContractInstance.getPastEvents("AnsDeclared", {

    fromBlock: 0,
    toBlock: 'latest'
  }).then(events =>//console.log(events)
    res.send(events)
  )
    .catch((err) => console.error(err));

});

app.get('/createAccount', function (req, res) {
  let result = web3.eth.accounts.create();
  res.send(result);

});

app.get('/importAccount/:pk', function (req, res) {
  let result = web3.eth.accounts.privateKeyToAccount(req.params.pk);
  res.send(result);
});


app.get('/getWinningbalance/:public', function (req, res) {
  ContractInstance.methods.getWinnningBalance(req.params.public).call({ from: config.from }, function (err, result) {
    if (!err)
      res.send(result);
    else
      console.log(err);
  })
});


app.post('/postQuestion', function (req, res) {
  console.log(req.body);

  encoded = ContractInstance.methods.postQuestion(req.body.qid, req.body.qcontent, String(Math.round(Number(req.body.pfee).toFixed(2) * 100)) + '0000000000000000', req.body.options, req.body.type, req.body.name).encodeABI()
  var tx = {
    to: ContractAddress,
    gasPrice: web3.eth.gasPrice,
    gas: "200000",
    data: encoded
  }

  web3.eth.accounts.signTransaction(tx, req.body.pkey).then(signed => {

    web3.eth.sendSignedTransaction(signed.rawTransaction).on('receipt', console.log).then(r => {
      res.send('success');//res.send('https://explorer.matic.network/tx/'+r['logs'][0]['transactionHash']);
    })
  });
});




app.post('/stopvoting', function (req, res) {

  console.log(req.body);


  encoded = ContractInstance.methods.stopVoting(req.body.qid).encodeABI()

  var tx = {
    to: ContractAddress,
    gasPrice: web3.eth.gasPrice,
    gas: "200000",
    data: encoded
  }

  web3.eth.accounts.signTransaction(tx, req.body.pk).then(signed => {

    web3.eth.sendSignedTransaction(signed.rawTransaction).on('receipt', console.log)
    res.send('success');
  });
});


app.post('/submitsolution', function (req, res) {
  console.log(req.body);


  encoded = ContractInstance.methods.submitRightSolution(req.body.qid, req.body.ansid, req.body.ans, req.body.reason).encodeABI()

  var tx = {
    to: ContractAddress,
    gasPrice: web3.eth.gasPrice,
    gas: "700000",
    data: encoded
  }

  web3.eth.accounts.signTransaction(tx, req.body.pkey).then(signed => {

    web3.eth.sendSignedTransaction(signed.rawTransaction).on('receipt', console.log).then(r => {
      res.send('success');//res.send('https://explorer.matic.network/tx/'+r['logs'][0]['transactionHash']);
    })
  });
});



app.post('/vote', function (req, res) {

  console.log(req.body);

  encoded = ContractInstance.methods.vote(req.body.qid, req.body.ans, req.body.amount + '00000000000000', req.body.name).encodeABI()

  var tx = {
    to: ContractAddress,
    gasPrice: web3.eth.gasPrice,
    gas: "200000",
    data: encoded,
    value: req.body.amount + '00000000000000'
  }


  web3.eth.accounts.signTransaction(tx, req.body.pkey).then(signed => {

    web3.eth.sendSignedTransaction(signed.rawTransaction).on('receipt', console.log);
    res.send('success');

  });

});


app.listen(process.env.PORT || 8080, () => console.log('my app listening on port 8080!'))
