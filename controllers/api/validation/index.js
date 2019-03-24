var express = require('express');
var router = express.Router();
var Controller = require('./controller')

//to add new transaction
router.post('/validate', (req, res)=> {
  Controller.verify(req,res);
}); 

module.exports = router;
