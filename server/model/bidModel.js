const {req, res} = require('express')
const con     = require('../../config/db');
const moment  = require('moment');
const { reject } = require('lodash');

const getBidCount = (userID, itemID) => {
    try{
        let condition = ` `
        if(itemID){
            condition = ` AND item_id = '${itemID}' `
        }

        return new Promise( (resolve, reject)=> {
            con.query(`SELECT COUNT(*) as bid_count FROM item_bid WHERE user_id = '${userID}' ${condition}`, (err, rows)=>{
                if(err){
                    return resolve({ code:500, status:'error' })
                }
                return resolve({ code:200, status:'success', data:rows[0]  })
            })
        });
    }catch (err){
        return reject({message:'Check User Exist', err})
    }
}

const getLastBid = (itemID) => {
    try{
        return new Promise( (resolve, reject)=> {
            con.query(`SELECT id, bid_offer, notes, user_id FROM item_bid WHERE item_id = '${itemID}' AND status = 1 ORDER BY created_date DESC LIMIT 1`, (err, rows)=>{
                if(err){
                    return resolve({ code:500, status:'error' })
                }
                return resolve({ code:200, status:'success', data:rows[0]  })
            })
        });
    }catch (err){
        return reject({message:'Check User Exist', err})
    }
}

const getInfoAuction = (bidID) => {
    try{
        return new Promise( (resolve, reject)=> {
            con.query(`SELECT ib.id, ib.bid_offer, ib.notes, ib.user_id, u.username, u.username, u.email FROM item_bid ib INNER JOIN users u ON ib.user_id = u.id WHERE ib.id = '${bidID}' AND ib.status = 1 ORDER BY ib.created_date DESC LIMIT 1`, (err, rows)=>{
                if(err){
                    return resolve({ code:500, status:'error' })
                }
                console.log(rows[0])
                return resolve({ code:200, status:'success', data:rows[0]  })
            })
        });
    }catch (err){
        return reject({message:'Check User Exist', err})
    }
}

const getInfoOwnBid = (bidID, id) => {
    try{
        return new Promise( (resolve, reject)=> {
            con.query(`SELECT ib.id, ib.item_id, ib.bid_offer, ib.item_id, ib.notes, ib.user_id, u.username, u.username, u.email FROM item_bid ib INNER JOIN users u ON ib.user_id = u.id WHERE ib.id = '${bidID}' AND ib.user_id = '${id}' ORDER BY ib.id DESC LIMIT 1`, (err, rows)=>{
                if(err){
                    return resolve({ code:500, status:'error' })
                }
                console.log(rows[0])
                return resolve({ code:200, status:'success', data:rows[0]  })
            })
        });
    }catch (err){
        return reject({message:'Check User Exist', err})
    }
}

const confirmBID = (itemID, userID) => {
    try{
        return new Promise( (resolve, reject)=> {
            con.query(`UPDATE item_bid SET status = 3 WHERE item_id = '${itemID}' AND user_id = ${userID} `, (err, __rows)=>{
                if(err){
                    console.log(err)
                    return resolve({ code:500, status:'error' })
                }
                return resolve({ code:200, status:'success' })
            })
        });
    }catch (err){
        return reject({message:'Check User Exist', err})
    }
}

const cancelBID = (itemID, userID) => {
    try{
        return new Promise( (resolve, reject)=> {
            con.query(`UPDATE item_bid SET status = 0 WHERE item_id = '${itemID}' AND user_id = ${userID} `, (err, __rows)=>{
                if(err){
                    console.log(err)
                    return resolve({ code:500, status:'error' })
                }
                return resolve({ code:200, status:'success', message: 'Your bid has been cancel' })
            })
        });
    }catch (err){
        return reject({message:'Check User Exist', err})
    }
}

module.exports = {
    getBidCount,
    getLastBid,
    getInfoAuction,
    getInfoOwnBid,
    confirmBID,
    cancelBID
}