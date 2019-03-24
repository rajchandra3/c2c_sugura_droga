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
    let updates = {
        to : req.body.to,
        from : req.body.from,
        timestamp : req.body.timestamp
    };
    let id = req.body.id;
    Product.findOne({id : id},(err,data)=>{
        if(err){
            Common.sendResponse(res,1,'Something went wrong!');
        }else if(data){
            bc.updateProduct(res,updates,id,{
                publicKey : data.publicKey,
                privateKey : data.privateKey
            });
        }else{
            Common.sendResponse(res,1,'Couldn\'t find the product');
        }
    })

}

exports.show1Product = (req,res)=>{
    let id = req.query.id;
    bc.viewProductDetail(id,res);
}

exports.showAllProducts = (req,res)=>{
    // bc.viewAllProduct(res);
    Product.find({},(err,products)=>{
        if(err){
            Common.sendResponse(res,1,'Error finding all products');
        }else{
            Common.sendResponse1Custom(res,0,'Serving all products!',{
                products : products
            });
        }
    })
}