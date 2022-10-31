const express 			= require('express');
const router  			= express.Router();
const moment            = require('moment')

const itemModel         = require('../model/itemModel');
const dbModel         = require('../model/dbModel');

const { request } = require('../../app');


const itemStatus = ["Deleted", "Draft", "Open", "On Bid", "Completed"]
const bidStatus = ["Cancel", "Bid", "Accepted", "Confirmed"]

const submitItem = async (req, res) => {
    try{
        const dataItem = {
            title:           req.body.title,
            description:     req.body.description,
            started_price:   req.body.started_price,
            started_date:    moment().format('YYYY-MM-DD HH:mm:ss'),
            created_date:    moment().format('YYYY-MM-DD HH:mm:ss'),
            status: 1,
            created_by: req.session.userid
        }
       
        const response = await dbModel.insertQuery(dataItem, 'item')
        if(response.code === 200){
            response.message = 'Item saved successfully'
        }
        return response;
    }catch(error){
        throw new Error(error)
    }
}

const filteredByStatus = (req, data) => {
    const response = []
    data.forEach(item => {
        delete item.created_date
        delete item.updated_date
        if(req.session.userid){
            if(item.created_by === req.session.userid){
                item.isOwner = true
                item.openBid = false
            }else{
                item.isOwner = false
                item.openBid = true
            }
        }else{
            item.isOwner = false
            item.openBid = false
        }
        if(item.status !== 1){
            item.openBid = false
        }
        item.status = itemStatus[item.status]
        if((item.created_by !== req.session.userid && item.status !== 'Draft') || item.created_by === req.session.userid){
            response.push(item)
        }
    });
    return response
}

const getListItem = async (req, res) => {
    try{
        const {status} = req.query
        let statusCondition = ''
        if(status === 'all'){
            statusCondition = '1'
        }
        const response = await itemModel.getItemList(req)
        const listItem = filteredByStatus(req, response.data)
        
        return Promise.resolve(listItem);
    }catch(error){
        throw new Error(error)
    }
}

const updateItem = async (req, res) => {
    try{
        let detailItem = await itemModel.detailItem(req.body.itemID)
            detailItem = detailItem.data[0]

        if(detailItem.created_by === req.session.userid && detailItem.status === 0){
            const dataItem = {
                title:           req.body.title,
                description:     req.body.description,
                started_price:   req.body.started_price,
                started_date:    req.body.started_date,
            }

            const response = await dbModel.updateQuery(dataItem, 'item', 'id', req.body.itemID)
            if(response.code === 200){
                response.message = 'Item Updated successfully'
            }
            return response;
        }
        return {code:400, message:'Access Denied'}
    }catch(error){
        throw new Error(error)
    }
}

const constructBidData = (data) => {
    let bidResponse = []
    if(data){
        data.forEach(item => {
            const bid = {
                id: item.id,
                username: item.username,
                bid_price: item.bid_offer,
                notes: item.notes,
                status: bidStatus[item.status]
            }
            bidResponse.push(bid)
        })
    }
    return bidResponse
}

const getDetailItem = async (req, res) => {
    try{
        const itemID = req.params.itemID || req.body.itemID
        const getDetail = await itemModel.detailItem(itemID)
        const getBID = await itemModel.listBidByItem(itemID)

        const dataDetail = getDetail.data[0]
        
        if(dataDetail){
            dataDetail.status = itemStatus[dataDetail.status]
            if(req.session.userid){
                if(dataDetail.created_by === req.session.userid){
                    dataDetail.isOwner = true
                    dataDetail.openBid = false
                }else{
                    dataDetail.isOwner = false
                    dataDetail.openBid = true
                }
            }else{
                dataDetail.isOwner = false
                dataDetail.openBid = false
            }
        }

        const bidResponse = constructBidData(getBID.data)
    
        let response = dataDetail
        if(dataDetail){
            response = { ...dataDetail, bid:bidResponse}
        }
        
        return Promise.resolve(response);
    }catch(error){
        throw new Error(error)
    }
}

const deleteItem = async (req, res) => {
    try{
        let detailItem = await itemModel.detailItem(req.body.itemID)
            detailItem = detailItem.data[0]

        if(detailItem && detailItem.created_by === req.session.userid){
            if(detailItem.status === 3){  // if status is completed
                return {code:204, message:`You can't delete completed bid`}
            }
            if(detailItem.status === 4){  // if status is completed
                return {code:204, message:`Item already deleted`}
            }
            const payloadDelete = { status: 4 }
            const response = await dbModel.updateQuery(payloadDelete, item, 'id', req.body.itemID)
            if(response.code === 200){
                response.message = 'Item deleted successfully'
            }
            return response;
        }
        return {code:400, message:'Access Denied'}
    }catch(error){
        throw new Error(error)
    }
}

module.exports = {
    submitItem,
    getListItem,
    updateItem,
    getDetailItem,
    deleteItem
}