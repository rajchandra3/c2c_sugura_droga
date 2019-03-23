var express = require('express');
var router = express.Router();
var controller = require('./controller');


//to get login
router.post('/login', (req, res)=>{
    controller.getCompanyLogin(req,res);
});

//to get signup
router.post('/register',(req,res)=>{
    controller.registerCompany(req,res);
})

module.exports = router;
