const express           = require('express');
const router            = express.Router();
const reply             = require('../helpers/response')
const generalHelper     = require('../helpers/generalHelper')
const walletHelper      = require('../helpers/walletHelper')
const itemHelper        = require('../helpers/itemHelper')
const bidHelper         = require('../helpers/bidHelper')
const moment            = require('moment')
const validationHelper  = require('../helpers/validationHelper');
const encryptionHelper  = require('../helpers/encryptionHelper')

const checkMyBid = async (req, res)=> {
    try{
        generalHelper.authValidation(req, res)
        const getBalance = await walletHelper.getMyBalance(req)
        
        return reply.send(res, getBalance)
    }catch(err){
        return reply.errorInternalServer(res,err)
    }
}

const processBid = async (req, res)=> {
    try{
        generalHelper.authValidation(req, res)
        const { error } = validationHelper.validateBid(req.body)
        if (error) return reply.InvalidRequest(res, error)

        // check bid count
        const getCount = await bidHelper.getCountBid(req)
        if(getCount.bid_count > 5){
            return reply.send(res, {code:400, message: 'Exceeded the number of auctions'})
        }

        // check last bid
        const getLastBid = await bidHelper.getLastBid(req)
        if(req.body.bid_offer <= getLastBid.bid_offer){
            return reply.send(res, {code:400, message: 'Bid must be above the last bid'})
        }

        // check wallet balance
        const checkWallet = await walletHelper.getMyBalance(req)
        const newBalance = parseFloat(checkWallet.balance) - parseFloat(req.body.bid_offer)     // Balance after bidding
        if(checkWallet.balance === null || newBalance < 0){
            return reply.send(res, {code:400, message: 'Your balance is not enough'})
        }

        // // check detail item
        const detailItem = await itemHelper.getDetailItem(req, res)
        if(detailItem && detailItem.status.toLowerCase() === 'draft'){
            return reply.send(res, {code:400, message: 'Auction not open yet'})
        }
        // error if open bid false
        if(detailItem && detailItem.openBid === false){
            return reply.send(res, {code:400, message: `You can't bid`})
        }
        // error if bid offer under started price
        if(detailItem && detailItem.started_price > req.body.bid_offer){
            return reply.send(res, {code:400, message: `Bid must be above the started price`})
        }
        
        // // bid process
        let response;
        response = await bidHelper.processBid(req, checkWallet)
        
        return reply.send(res, response)
    }catch(err){
        return reply.errorInternalServer(res,err)
    }
}

const acceptBid = async (req, res)=> {
    try{
        generalHelper.authValidation(req, res)
        const { error } = validationHelper.validateAcceptBid(req.body)
        if (error) return reply.InvalidRequest(res, error)

        // check detail item
        const detailItem = await itemHelper.getDetailItem(req, res)
        if(detailItem && detailItem.isOwner !== true){
            return reply.send(res, {code:400, message: `Access Denied`})
        }

        // check detail auction
        const detailBID = await bidHelper.getDetailBid(req, res)
        if(detailBID){
            // Send Bid Token and Confirmation Link
            const response = await bidHelper.acceptBid(req, detailBID)
            return reply.send(res, response)
        }
        return reply.send(res, {code:400, message:`user unable confirm bid`})
    }catch(err){
        return reply.errorInternalServer(res,err)
    }
}

const confirmBid = async (req, res)=> {
    try{
        const {token} = req.body
        generalHelper.authValidation(req, res)
        const { error } = validationHelper.validateConfirmBid(req.body)
        if (error) return reply.InvalidRequest(res, error)
      
        const decryptedToken = encryptionHelper.decryptPayload(token)
        if(!decryptedToken){
            return reply.send(res, {code:400, message: `Token Expired`})
        }

        // check detail auction
        const detailBID = await bidHelper.getMyBid(decryptedToken.bidID, req.session.userid)
        if((detailBID && detailBID.user_id !== req.session.userid) || !detailBID){
            return reply.send(res, {code:400, message: `Access Denied`})
        }

        // check Wallet
        const checkWallet = await walletHelper.getMyBalance(req)
        if(checkWallet.balance === null){
            return reply.send(res, {code:400, message:checkWallet.message})
        }

        const tempBalance = checkWallet.balance - parseFloat(detailBID.bid_offer)
        if(tempBalance < 0){
            return reply.send(res, {code:400, message: `Out of Balance`})
        }

        // Purchase Bid
        const dataWallet = {
            walletID: checkWallet.walletID,
            credit: detailBID.bid_offer,
            balance: checkWallet.balance
        }
        const response = await walletHelper.purchaseBid(req, dataWallet)
        if(response.code === 200){
            // Update Status BID
            await bidHelper.updateBidItem(detailBID)
        }
        return reply.send(res, response);        
    }catch(err){
        return reply.errorInternalServer(res,err)
    }
}

const cancelBid = async (req, res)=> {
    try{
        const {token} = req.body
        generalHelper.authValidation(req, res)
        const { error } = validationHelper.validateConfirmBid(req.body)
        if (error) return reply.InvalidRequest(res, error)
      
        const decryptedToken = encryptionHelper.decryptPayload(token)
        if(!decryptedToken){
            return reply.send(res, {code:400, message: `Token Expired`})
        }

        // check detail auction
        const detailBID = await bidHelper.getMyBid(decryptedToken.bidID, req.session.userid)
        if((detailBID && detailBID.user_id !== req.session.userid) || !detailBID){
            return reply.send(res, {code:400, message: `Access Denied`})
        }

        const response = await bidHelper.updateCanceledBid(detailBID)
        return reply.send(res, response);        
    }catch(err){
        return reply.errorInternalServer(res,err)
    }
}

router.get('/history', checkMyBid)
router.post('/process', processBid)
router.post('/accept', acceptBid)
router.post('/confirm', confirmBid)
router.post('/cancel', cancelBid)


module.exports = router;