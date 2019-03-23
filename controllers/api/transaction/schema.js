const mongoose = require('mongoose')
const _ = require('underscore');
const shortid = require('shortid');

var transactionSchema = new mongoose.Schema({
    uid : {type : String, default : shortid.generate},
    id : String,
    product : {type:mongoose.Schema.Types.ObjectId, ref : 'Product'}, // product in transaction
    to : {type:mongoose.Schema.Types.ObjectId, ref : 'Company'}, // transferred to
    from : {type:mongoose.Schema.Types.ObjectId, ref : 'Company'} //transferred from
},{timestamps : true});

module.exports = mongoose.model('Transaction', transactionSchema);