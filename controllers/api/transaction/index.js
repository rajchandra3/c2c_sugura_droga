var express = require('express');
var router = express.Router();
var Controller = require('./controller')

//to add new transaction
router.get('/', (req, res)=> {
  Controller.fetchAllTransactions(req,res);
}); 

module.exports = router;
