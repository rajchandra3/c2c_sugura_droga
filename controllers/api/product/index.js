var express = require('express');
var router = express.Router();
var Controller = require('./controller')
var Product = require('./schema')

//to show any product
router.get('/view', (req, res)=> {
  Controller.show1Product(req,res);
});  

//add new product
router.get('/add', (req, res)=> {
  Controller.addNewProduct(req,res);
}); 

//update product
router.get('/update', (req, res)=> {
  Controller.updateProduct(req,res);
}); 

module.exports = router;
