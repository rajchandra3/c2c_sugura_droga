exports.sendResponse = (res,code,message)=>{
    res.send({ code,message });
}

exports.sendResponse1Custom = (res,code,message,customData)=>{
    res.send({code,message,data:customData});
}
