var express = require('express');
var router = express.Router();
var Controller = require('./controller')

//to show any product
router.get('/details', (req, res)=> {
  Controller.show1Product(req,res);
});

//to show any product
router.get('/fetch', (req, res)=> {
  Controller.showAllProducts(req,res);
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
