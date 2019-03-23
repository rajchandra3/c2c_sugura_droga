const BigchainDB = require('bigchaindb-driver')
const bip39 = require('bip39')
const Orm = require('bigchaindb-orm').default;
const API_PATH = 'https://test.bigchaindb.com/api/v1/';
const bdbOrm = new Orm(API_PATH);
const conn = new BigchainDB.Connection(API_PATH);
bdbOrm.define("companies", "https://schema.org/v1/companies");
bdbOrm.define("products", "https://schema.org/v1/products");

const Company = require('./../api/company/schema');
const Product = require('./../api/product/schema');
const Transaction = require('./../api/transaction/schema');

const Common = require('./../api/utilities/responses')

//Creation of a key pair
let createKeys = ()=>{
    const seed = bip39.mnemonicToSeed('seedPhrase').slice(0,32);
    return new BigchainDB.Ed25519Keypair(seed);
}

/**
 * Add new company to the chain
 * @param {String} company 
 */
let addCompany = (res,company)=>{
    const companyKeys = createKeys();
    // Construct a transaction payload
    const txCreatePaint = BigchainDB.Transaction.makeCreateTransaction(
        // Asset field
        {
            name: company.name
        },
        // Metadata field, contains information about the transaction itself
        // (can be `null` if not needed)
        {
            timestamp: new Date().toString(),
            products : []
        },
        // Output. For this case we create a simple Ed25519 condition
        [BigchainDB.Transaction.makeOutput(
            BigchainDB.Transaction.makeEd25519Condition(companyKeys.publicKey))],
        // Issuers
        companyKeys.publicKey
    )
    // The owner of the painting signs the transaction
    const txSigned = BigchainDB.Transaction.signTransaction(txCreatePaint,
        companyKeys.privateKey)

    // Send the transaction off to BigchainDB
    conn.postTransactionCommit(txSigned)
        .then(block => {
            //save the name, publicKey and id of the company into mongo database
            Company.updateOne({uname : company.uname},{
                id : block.id,
                publicKey : companyKeys.publicKey,
                privateKey : companyKeys.privateKey
            },(err,done)=>{
                if(!err && done){
                    //send response
                    Common.sendResponse1Custom(res,0,`Company created successfully`,{
                        transaction_id : `did:${txSigned.id}`
                    })
                }else{
                    //send response
                    Common.sendResponse(res,1,`Problem while creating the company`);
                }
            })
        })
}

/**
 * Update product in the company
 * @param {Object} companyData- company details from the mongo database
 * @param {String} did - Decentralized id
 * @param {String} productData - New Product
 */

let addProduct = (res,product)=>{
    const productKeys = createKeys();
    // Construct a transaction payload
    const txCreatePaint = BigchainDB.Transaction.makeCreateTransaction(
        // Asset field
        {
            name: product.name
        },
        // Metadata field, contains information about the transaction itself
        // (can be `null` if not needed)
        {
            cost : product.cost,
            manufactured : {
                by : product.by,
                on : product.on,
                for : product.for,
                expires : product.expires
            },
            timestamp: Date.now(),
            timeline : []
        },
        // Output. For this case we create a simple Ed25519 condition
        [BigchainDB.Transaction.makeOutput(
            BigchainDB.Transaction.makeEd25519Condition(productKeys.publicKey))],
        // Issuers
        productKeys.publicKey
    )
    // The owner of the painting signs the transaction
    const txSigned = BigchainDB.Transaction.signTransaction(txCreatePaint,
        productKeys.privateKey)

    // Send the transaction off to BigchainDB
    conn.postTransactionCommit(txSigned)
        .then(block => {
            //save the name, publicKey and id of the company into mongo database
            Product.updateOne({uid : product.uid},{
                id : block.id,
                publicKey : productKeys.publicKey,
                privateKey : productKeys.privateKey
            },(err,done)=>{
                if(!err && done){
                    //send rfid to aman
                    console.log(`${productKeys.publicKey} being sent to aman`)
                    //send response
                    Common.sendResponse1Custom(res,0,`Product added successfully`,{
                        transaction_id : `did:${txSigned.id}`
                    })
                }else{
                    //send response
                    Common.sendResponse(res,1,`Problem while adding the product`);
                }
            })
        })
}

module.exports = {
    createKeys : createKeys,
    addCompany : addCompany,
    addProduct : addProduct
    // updateCompany : updateProduct,
    // updateProduct : updateProduct
}