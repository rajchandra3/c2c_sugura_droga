const Common = require('./../utilities/responses');
const Product = require('./schema');
const bc = require('./../../db/setup')

exports.addProduct = (req,res)=>{
    Product.create({
        name : req.body.name,
        manufactured : {
            by : req.body.by,
            for : req.body.rfid,
            expires : req.body.expires
        },
        cost : req.body.cost
    },(err,data)=>{
        if(err){
            Common.sendResponse(res,1,'Error adding new Product');
        }else if(!err && data){
            bc.addProduct(res,data);
        }
    })
}

exports.updateProduct = (req,res)=>{

}

exports.show1Product = (req,res)=>{

}