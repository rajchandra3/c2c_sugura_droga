var jwt = require('jsonwebtoken');

exports.generateToken = (company,callback)=>{
    let companyData = {
        companyName : company.companyName,
        id : company._id
    }
    var token = jwt.sign(companyData, process.env.SECRET, {expiresIn: 86400}); // 1day
    callback(token);
}