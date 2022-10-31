const express           = require('express');
const router            = express.Router();
const reply             = require('../helpers/response')
const generalHelper     = require('../helpers/generalHelper')
const walletHelper      = require('../helpers/walletHelper')
const moment            = require('moment')
const validationHelper  = require('../helpers/validationHelper');

const checkMyBalance = async (req, res)=> {
    try{
        generalHelper.authValidation(req, res)
        const getBalance = await walletHelper.getMyBalance(req)
        
        return reply.send(res, getBalance)
    }catch(err){
        return reply.errorInternalServer(res,err)
    }
}

const registrationWallet = async (req, res)=> {
    try{
        generalHelper.authValidation(req, res)
        const { error } = validationHelper.validateRegisterWallet(req.body)
        if (error) return reply.InvalidRequest(res, error)
        
        // check wallet if already exist
        const checkWallet = await walletHelper.getMyBalance(req)
        if(checkWallet.balance === null){
            const response = await walletHelper.registerWallet(req)
            return reply.send(res, response)
        }
        return reply.send(res, {code:400, message: 'Wallet account already registered'})
    }catch(err){
        return reply.errorInternalServer(res,err)
    }
}

const processTransaction = async (req, res)=> {
    try{
        generalHelper.authValidation(req, res)
        const { error } = validationHelper.validateTransaction(req.body)
        if (error) return reply.InvalidRequest(res, error)

        const checkWallet = await walletHelper.getMyBalance(req)
        if(checkWallet.balance === null){
            return reply.send(res, {code:400, message:checkWallet.message})
        }

        // Check wallet ID
        if(checkWallet.walletID.toString() !== req.body.walletID){
            return reply.send(res, {code:400, message:'ACCESS DENIED'})
        }

        let response;
        if(req.body.keyword.toLowerCase() === 'topup'){
            response = await walletHelper.topupBalance(req, checkWallet)
        }else{
            response = await walletHelper.purchaseBid(req, checkWallet)
        }
        
        return reply.send(res, response)
    }catch(err){
        return reply.errorInternalServer(res,err)
    }
}

const myHistory = async (req, res)=> {
    try{
        generalHelper.authValidation(req, res)
        const response = await walletHelper.getMyHistory(req)
        
        return reply.send(res, response)
    }catch(err){
        return reply.errorInternalServer(res,err)
    }
}

router.get('/balance', checkMyBalance)
router.post('/register', registrationWallet)
router.post('/transaction', processTransaction)
router.get('/history', myHistory)

module.exports = router;