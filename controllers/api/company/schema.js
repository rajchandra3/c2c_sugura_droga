const mongoose = require('mongoose')
const _ = require('underscore');
const bcrypt = require('bcryptjs');
const shortid = require('shortid');

var companySchema = new mongoose.Schema({
    uid : {type : String, default : shortid.generate},
    id : String,
    name: { type: String },
    password: { type: String, required : true},
    publicKey: { type: String },
    privateKey: { type: String },
    uname: {type: String, required: true, trim: true, unique: true},
    products : [{
        name : String,
        publicKey : String,
        uid : String
    }]
},{timestamps : true});

module.exports = mongoose.model('Company', companySchema);