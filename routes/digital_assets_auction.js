var express = require('express');
var router = express.Router();
const Web3 = require('web3');
const web3 = new Web3(process.env.ETHEREUM_NODE_URL);
const AuctionContract = require('../abis/Auctions.json')
const NftAssetContract = require('../abis/NftAsset.json')
const schedule = require('node-schedule');
const JSONdb = require('simple-json-db');
const local_db = new JSONdb('./db/database.json');

async function endDigitalAssetAuction(job){
    console.log("Executing scheduled job: ");
    try{
        const nftId = job.nftId;
        console.log(nftId);
        const networkId = await web3.eth.net.getId();
        const auctionDeployedNetwork = AuctionContract.networks[networkId];
        const nftDeployedNetwork = NftAssetContract.networks[networkId];
        const auction_contract = new web3.eth.Contract(AuctionContract.abi, auctionDeployedNetwork.address);
        const nft_asset_contract = new web3.eth.Contract(NftAssetContract.abi, nftDeployedNetwork.address);
        const end_date_time  = Date.now();
        
        // end auction call
        const tx1 = auction_contract.methods.EndAuction(nftId, end_date_time);
        let gas = await tx1.estimateGas({from: process.env.ETHEREUM_ACCOUNT_ADDRESS});
        let gasPrice = await web3.eth.getGasPrice();
        let data = await tx1.encodeABI();
        let nonce = await web3.eth.getTransactionCount(process.env.ETHEREUM_ACCOUNT_ADDRESS);
        const signed_tx1 = await web3.eth.accounts.signTransaction({
            to: auctionDeployedNetwork.address,
            data: data,
            gas: gas,
            gasPrice: gasPrice,
            nonce: nonce,
            chainId: networkId
        }, process.env.ETHEREUM_ACCOUNT_PRIVATE_KEY);

        const receipt = await web3.eth.sendSignedTransaction(signed_tx1.rawTransaction);
        console.log(receipt);
        const result1 = await auction_contract.methods.GetAuctionDetails(nftId).call();
        const sell_data = {
            nftId: nftId,
            prevOwner: job.owner_account,
            newOwner: result1[0],
        }
        console.log("End Auction:", sell_data);


        // transfer ownership of NFT asset
        const tx2 = nft_asset_contract.methods.transferAssetOwnership(sell_data.prevOwner, sell_data.newOwner, sell_data.nftId);
        gas = await tx2.estimateGas({from: process.env.ETHEREUM_ACCOUNT_ADDRESS});
        gasPrice = await web3.eth.getGasPrice();
        data = await tx2.encodeABI();
        nonce = await web3.eth.getTransactionCount(process.env.ETHEREUM_ACCOUNT_ADDRESS);
        const signed_tx2 = await web3.eth.accounts.signTransaction({
            to: nftDeployedNetwork.address,
            data: data,
            gas: gas,
            gasPrice: gasPrice,
            nonce: nonce,
            chainId: networkId
        }, process.env.ETHEREUM_ACCOUNT_PRIVATE_KEY);
        const result2 = await web3.eth.sendSignedTransaction(signed_tx2.rawTransaction);

        // remove from database
        local_db.delete(nftId.toString());
        console.log("Job"+nftId+" is deleted successfully");

    }catch(err){
        console.log(err);
        throw err;
        // res.status(500).send(err);
    }
}


router.post('/create_digital_auction', async function(req, res, next) {
    try{
        const nftId = req.body.nftId;
        const end_date_time = req.body.end_date_time;
        const owner_account = req.body.owner_account;
        const job_name = "job_"+nftId;
        const data = {nftId, end_date_time, owner_account, job_name};
        
        schedule.scheduleJob(job_name, end_date_time, function(){
            endDigitalAssetAuction(data)
        }.bind(null, data));

        local_db.set(nftId, data);
        res.status(201).send({message: "Digital Auction created successfully"});
    }catch(err){
        console.log(err);
        res.status(500).send({message: "Internal Server Error"});
    }
});

const rescheduleJobs = async()=>{
    try{
        const auctions =  local_db.storage;
        for(const prop in auctions){
            const job_name = auctions[prop].job_name;
            const end_date_time = new Date(auctions[prop].end_date_time);
            if(end_date_time < Date.now()){
                console.log("Job:", job_name, "is due to end");
                await endDigitalAssetAuction(auctions[prop]);
            }else{
                const params = auctions[prop];
                schedule.scheduleJob(job_name, end_date_time, function(params){
                    endDigitalAssetAuction(params);
                }.bind(null, params));
            }
        }
    }catch(err){
        console.log(err);
    }
}

module.exports = router;
module.exports.rescheduleJobs = rescheduleJobs;
