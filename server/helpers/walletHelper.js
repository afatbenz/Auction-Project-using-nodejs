const express 			= require('express');
const router  			= express.Router();
const moment            = require('moment')

const walletModel         = require('../model/walletModel');
const dbModel         = require('../model/dbModel');

const { request } = require('../../app');

const getMyBalance = async (req, res) => {
    try{
        const getBalance = await walletModel.getBalance(req.session.userid)

        const response = {
            walletID: null,
            balance: null
        };
        if(getBalance.data.length > 0){
            response.walletID = getBalance.data[0].id
            if(getBalance.data[0].updated_date){
                response.message = `Your last transaction ${moment(getBalance.data[0].updated_date).format('DD MMMM YYYY HH:ss')} `
            }else{
                response.message = `Your dont have transaction`
            }
            response.balance = getBalance.data[0].balance
        }else{
            response.balance = null
            response.message = 'You dont have wallet'
        }
        return response;
    }catch (err){
        throw new Error(err)
    }
}

const registerWallet = async (req, res) => {
    try{
        const data = {
            user_id:  req.session.userid,
            balance:  0,
            fullname: req.body.fullname,
            nik:   req.body.nik,
            status: 1,
            created_date: moment().format('YYYY-MM-DD HH:mm:ss')
        }
       
        const response = await dbModel.insertQuery(data, 'wallet')
        if(response.code === 200){
            response.message = 'Wallet register successfully'
        }
        return response;
    }catch(error){
        throw new Error(error)
    }
}

const topupBalance = async (req, dataWallet) => {
    try{
        const dataTrx = {
            wallet_id: dataWallet.walletID,
            user_id:  req.session.userid,
            balance:  parseFloat(req.body.credit),
            created_date: moment().format('YYYY-MM-DD HH:mm:ss'),
            label: 'Topup Credit'
        }
        
        // Insert Transaction History
        const postTrxData = await dbModel.insertQuery(dataTrx, 'wallet_transaction')
        
        let response;
        if(postTrxData.code === 200){
            const dataUpdate = {
                balance: parseFloat(dataWallet.balance) + parseFloat(req.body.credit)
            }
            
            // Update Balance
            const updateBalance = await dbModel.updateQuery(dataUpdate, 'wallet', 'id', req.body.walletID)
            if(updateBalance.code === 200){
                updateBalance.message = 'Topup Transaction Success'
            }
            response = updateBalance
        }
        return response;
    }catch(error){
        throw new Error(error)
    }
}

const purchaseBid = async (req, dataWallet) => {
    try{
        const dataTrx = {
            wallet_id: dataWallet.walletID,
            user_id:  req.session.userid,
            balance:  parseFloat(dataWallet.bid_offer),
            created_date: moment().format('YYYY-MM-DD HH:mm:ss'),
            label: 'Purchase'
        }
        
        // Insert Transaction History
        const postTrxData = await dbModel.insertQuery(dataTrx, 'wallet_transaction')
        
        let response;
        if(postTrxData.code === 200){
            const dataUpdate = {
                balance: parseFloat(dataWallet.balance) - parseFloat(dataWallet.bid_offer)
            }
            
            // Update Balance Wallet
            const updateBalance = await dbModel.updateQuery(dataUpdate, 'wallet', 'id', dataWallet.walletID)
            if(updateBalance.code === 200){
                updateBalance.message = 'Topup Transaction Success'
            }
            response = updateBalance
        }
        return response;
    }catch(error){
        throw new Error(error)
    }
}

const getMyHistory = async (req, res) => {
    try{
        const id = req.session.userid
        const start_date = req.query.start_date
        const end_date = req.query.start_date
        const status = req.query.status

        const getHistory = await walletModel.getHistory({id, start_date, end_date, status})
        const response = [];
        
        getHistory.data.forEach(item => {
            let flag
            const label = item.label.toLowerCase()
            if(label.includes('topup')){
                flag = '+'
            }else{
                flag = '-'
            }
            const dataHistory = { id: item.id, label: item.label, flag, balance: item.balance, transaction_date: item.created_date }
            response.push(dataHistory)
        });
        
        
        return response;
    }catch (err){
        throw new Error(err)
    }
}

module.exports = {
    getMyBalance,
    registerWallet,
    topupBalance,
    purchaseBid,
    getMyHistory
}