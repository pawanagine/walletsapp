var express = require('express');
var router = express.Router();
const shortid = require('shortid');
const ErrorResponse = require("../util/ErrorResponse");

// Recordset for wallets
const wallets = [];

// Recordset for wallets transactions
const walletTransactions = [];

/* Create wallet. */
router.post('/', function(req, res, next) {
  const id = shortid.generate();
  if (!req.body.balance || typeof req.body.balance !== "number" || req.body.balance < 0) {
    return res.status(400).send(ErrorResponse('Invalid request body supplied'));
  }
  const walletObj = {
    id,
    name: req.body.name,
    balance: req.body.balance,
    createdDate: new Date()
  }
  wallets.push(walletObj);
  walletTransactions.push({
    id: shortid.generate(),
    walletId: walletObj.id,
    amount: walletObj.balance,
    balance: walletObj.balance,
    createdDate: new Date()
  });
  // console.log(wallets);
  res.status(201).send(walletObj);
});

/* GET wallet by id. */
router.get('/:id', function(req, res, next) {
  const wallet = wallets.find(wallet => wallet.id === req.params.id);
  if (!wallet) {
    return res.status(404).send(ErrorResponse("Wallet not found"))
  }
  res.status(200).send(wallet);
});

/* Deposit/withdraw money. */
router.put('/:id/transactions', function(req, res, next) {
  const walletIndex = wallets.findIndex(wallet => wallet.id === req.params.id);
  if (walletIndex < 0) {
    return res.status(404).send(ErrorResponse("Wallet not found"))
  }
  if (req.body.amount === 0 || typeof req.body.amount !== "number" || (req.body.amount < 0 && Math.abs(req.body.amount) > wallets[walletIndex].balance)) {
    return res.status(400).send(ErrorResponse('Invalid amount'))
  }
  wallets[walletIndex].balance += req.body.amount;
  const transactionObj = {
    id: shortid.generate(),
    walletId: req.params.id,
    amount: req.body.amount,
    balance: wallets[walletIndex].balance,
    createdDate: new Date()
  };
  walletTransactions.push(transactionObj);
  res.status(201).send(transactionObj);
});

/* GET users listing. */
router.get('/:id/transactions', function(req, res, next) {
  const wallet = wallets.find(wallet => wallet.id === req.params.id);
  if (!wallet) {
    return res.status(404).send(ErrorResponse("Wallet not found"))
  }
  const transactions = walletTransactions.filter(tr => tr.walletId === req.params.id);
  res.send(transactions);
});

module.exports = router;
