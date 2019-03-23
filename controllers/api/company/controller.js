const Common = require('./../utilities/responses');
const Auth = require('./../utilities/auth');
const Company = require('./schema');
const bc = require('./../../db/setup');

exports.getCompanyLogin = (req,res)=>{
    console.log(req.body)
    uname = req.body.uname.trim(),
    password = req.body.password
    if(!uname || !password){
        Common.sendResponse(res,1,`Username or Password can't be empty!`);
    }else{
        Company.findOne({uname : uname})
        .then((companyData)=>{
            if(companyData.password === password){
                //login successfull
                Auth.generateToken(companyData, (token)=>{
                    Common.sendResponse1Custom(res,0,'Login Successful',{cookie : token});
                })
            }else{
                //invalid credentials
                Common.sendResponse(res,1,'Invalid username or password');
            }
        })
    } 
}

exports.registerCompany = (req,res)=>{
    /**
     * @todo - Add Authentication
     */
    Company.create({
        name : req.body.name,
        password : req.body.password,
        uname : req.body.uname
    },(err,data)=>{
        if(err && err.code === 11000){
            Common.sendResponse(res,1,'This company is already registered')
        }else if(err){
            Common.sendResponse(res,1,'Something is not right here :/');
        }else if(data){
            bc.addCompany(res,data);
        }
    });
}
