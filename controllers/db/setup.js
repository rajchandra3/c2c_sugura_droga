const BigchainDB = require('bigchaindb-driver')
const bip39 = require('bip39')
const Orm = require('bigchaindb-orm').default;
const request = require('request')


const API_PATH = 'https://test.bigchaindb.com/api/v1/';
const bdbOrm = new Orm(API_PATH);
const conn = new BigchainDB.Connection(API_PATH);

bdbOrm.define("companies", "https://schema.org/v1/companies");
bdbOrm.define("products", "https://schema.org/v1/products");

const Company = require('./../api/company/schema');
const Product = require('./../api/product/schema');
const Transaction = require('./../api/transaction/schema');
const Validate = require('./../api/validation/schema');

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
                by : product.manufactured.by,
                on : product.manufactured.on,
                for : product.manufactured.for,
                expires : product.manufactured.expires
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
                    request({
                        url:`${process.env.API}/temp`,
                        method: "POST",
                        form: {
                            cmd: "write",
                            key: productKeys.publicKey
                        }},
                        (err, response, body)=> {
                        if (err) {
                            Common.sendResponse(res,1,'Error sending key to rfid scanner');
                        }else{
                            Common.sendResponse1Custom(res,0,`Product added successfully`,{
                                transaction_id : `did:${txSigned.id}`
                            })
                            //map rfid to public key
                            let id = body.replace(' ','');
                            Validate.create({
                                key : productKeys.publicKey,
                                rfid : id
                            })
                        }
                      });
                }else{
                    //send response
                    Common.sendResponse(res,1,`Problem while adding the product`);
                }
            })
        })
}

//fetch any block using id
let viewProductDetail = (id,res)=>{
    bdbOrm.models.products
    .retrieve(id)
    .then(blocks => {
        // assets is an array of products
        block = blocks[0].transactionHistory;
        res.send({
            asset : block.asset,
            meta : block.data,
            id : block.id
        });
    })
}

//to fetch all prodcucts
let viewAllProduct = (res)=>{
    bdbOrm
    .models
    .products
    .retrieve()
    .then(assets => {
        res.send(assets.map(asset => asset.id));
    })
}

//update all products
let updateProduct = (res,updates,keys,id)=>{
    bdbOrm.models.products
    .retrieve(id)
    .then(asset => {
        // lets append update the data of our asset
        // since we use a blockchain, we can only append
        asset.append({
            toPublicKey: keys.publicKey,
            keypair: keys,
            data: {
                timeline : {
                    to : updates.to,
                    from : udpates.from,
                    timestamp : updates.timestamp
                }
             }
        })
    })   
    .then(updatedAsset => {
        // updatedAsset contains the last (unspent) state
        Common.sendResponse(res,0,'Updates done!');
    })
}

module.exports = {
    createKeys : createKeys,
    addCompany : addCompany,
    addProduct : addProduct,
    viewProductDetail : viewProductDetail,
    viewAllProduct : viewAllProduct,
    updateProduct : updateProduct
}