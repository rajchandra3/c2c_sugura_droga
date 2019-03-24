const mongoose = require('mongoose')
const _ = require('underscore');
const shortid = require('shortid');

var validationSchema = new mongoose.Schema({
    uid : {type : String, default : shortid.generate},
    rfid : String,
    key : String
},{timestamps : true});

module.exports = mongoose.model('Map', validationSchema);