const Common = require('./../utilities/responses');
const Validate = require('./schema');
const Product = require('./../product/schema')

exports.verify = (req,res)=>{
    let rfid = req.body.rfid,
        key = req.body.key;
    Validate.findOne({ rfid },(err,data)=>{
        if(err){
            Common.sendResponse(res,1,'Error while finding the rfid');
        }else if(!data){
            Common.sendResponse(res,1,'Counterfeit Product! Please contact the concerned authorities');
        }else {
            if(rfid === data.rfid && key === data.key){
                Product.findOne({publicKey : key},(err,productData)=>{
                    if(err){
                        Common.sendResponse(res,1,'Error while fetching the product details');
                    }else{
                        Common.sendResponse1Custom(res,0,'Valid Package!',
                        {
                            name : productData.name,
                            cost : productData.cost,
                            manufactured : {
                                by : productData.by,
                                on : productData.on,
                                for : productData.for,
                                expires : productData.expires
                            }
                        })
                    }
                })
            }
        }
    })
}