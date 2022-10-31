const express 			= require('express');
const router  			= express.Router();
const moment            = require('moment')
const encryptionHelper  = require('../helpers/encryptionHelper')

const bidModel         = require('../model/bidModel');
const dbModel         = require('../model/dbModel');

const { request } = require('../../app');

const getCountBid = async (req, res) => {
    try{
        const { itemID } = req.body
        const getBalance = await bidModel.getBidCount(req.session.userid, itemID)
        
        return getBalance.data;
    }catch (err){
        throw new Error(err)
    }
}

const getLastBid = async (req, res) => {
    try{
        const { itemID } = req.body
        const lastBid = await bidModel.getLastBid(itemID)
        if(!lastBid.data){
            lastBid.data = { bid_offer: 0 }
        }
        
        return lastBid.data;
    }catch (err){
        throw new Error(err)
    }
}

const processBid = async (req, res) => {
    try{
        const { itemID, bid_offer, notes } = req.body
        const data = {
            user_id:  req.session.userid,
            bid_offer: parseFloat(bid_offer),
            item_id:   itemID,
            notes,
            status: 1,
            created_date: moment().format('YYYY-MM-DD HH:mm:ss')
        }
       
        const response = await dbModel.insertQuery(data, 'item_bid')
        if(response.code === 200){
            response.message = 'Bid successfully'
        }
        return response;
    }catch(error){
        throw new Error(error)
    }
}

const getDetailBid = async (req, res) => {
    try{
        const { bidID } = req.body
        const infoAuction = await bidModel.getInfoAuction(bidID)
        
        return infoAuction.data;
    }catch (err){
        throw new Error(err)
    }
}

const getMyBid = async (bidID, userID) => {
    try{
        const infoOwnBid = await bidModel.getInfoOwnBid(bidID, userID)
        console.log("infoOwnBid ==",infoOwnBid.data)
        return infoOwnBid.data;
    }catch (err){
        throw new Error(err)
    }
}

const acceptBid = async (req, res) => {
    try{
        const { itemID, bidID } = req.body

        // Update status item from Open to On bid
        const dataItem = { status: 3 }
        await dbModel.updateQuery(dataItem, 'item', 'id', itemID)

        // Update Data BID
        const dataBID = { status: 2 }
        const updateBID = await dbModel.updateQuery(dataBID, 'item_bid', 'id', bidID)
        let response;
        if(updateBID.code === 200){
            // Send Email Notification

            // generatelink
            const payloadLink = {bidID}
            const encryptedLink = encryptionHelper.encryptPayload(payloadLink, 24)
            response = {
                redirect_url: `localhost:3000/jitera/item/detail/${itemID}?token=${encryptedLink}`
            }
        }else{
            response = updateBID;
        }
        
        return response;
    }catch(error){
        throw new Error(error)
    }
}

const updateCompletedBid = async (dataBID) => {
    try{
        const { item_id, user_id } = dataBID
        const dataItem = { status: 4 }
        await dbModel.updateQuery(dataItem, 'item', 'id', item_id)

        // Update Data BID
        const dataBID = { status: 3 }
        await bidModel.confirmBID(item_id, user_id)
       
        return response;
    }catch(error){
        throw new Error(error)
    }
}

const updateCanceledBid = async (dataBID) => {
    try{
        const { item_id, user_id } = dataBID
        const dataItem = { status: 0 }
        await dbModel.updateQuery(dataItem, 'item', 'id', item_id)

        // Update Data BID
        const dataBID = await bidModel.cancelBID(item_id, user_id)
       
        return dataBID;
    }catch(error){
        throw new Error(error)
    }
}

module.exports = {
    getCountBid,
    getLastBid,
    processBid,
    getDetailBid,
    getMyBid,
    acceptBid,
    updateCompletedBid,
    updateCanceledBid
}