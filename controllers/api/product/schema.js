const mongoose = require('mongoose')
const _ = require('underscore');
const shortid = require('shortid');

var productSchema = new mongoose.Schema({
    uid : {type : String, default : shortid.generate},
    id : String,
    name: { type: String },
    cost : { String },
    manufactured : {
        by : {type : String}, //name of company
        on : {type : String, default : Date.now()}, //date of manufacture
        for : {type : String}, //rfid unique id
        expires : {type : String, default : Date.now()}
    },
    publicKey: { type: String },
    privateKey: { type: String },
    timeline : [{
        timestamp : {type : String},
        report : {type : Boolean, default : false},
        to : String,
        from : String
    }]
},{timestamps : true});

module.exports = mongoose.model('Product', productSchema);