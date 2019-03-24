var express = require('express');
var router = express.Router();
var Controller = require('./controller')

//to show any product
router.get('/view', (req, res)=> {
  Controller.show1Product(req,res);
});

//add new product
router.post('/add', (req, res)=> {
  Controller.addProduct(req,res);
});

//update product
router.get('/update', (req, res)=> {
  Controller.updateProduct(req,res);
}); 

module.exports = router;
