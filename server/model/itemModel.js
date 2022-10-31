const {req, res} = require('express')
const con     = require('../../config/db');
const moment  = require('moment');
const { reject } = require('lodash');

const selectQuery = (listTable, ref_field, id) => {
    try{
        return new Promise( (resolve, reject)=> {
            con.query(`SELECT ${table} SET ? WHERE ${ref_field} = '${id}' `, payload, (err, __rows)=>{
                if(err){
                    return resolve({ code:500, status:'error' })
                }
                return resolve({ code:200, status:'success' })
            })
        });
    }catch (err){
        return reject({message:'Check User Exist', err})
    }
}

const getItemList = (req) => {
    try{
        return new Promise( (resolve, reject)=> {
            let creatorCondition = ''
            if(req.session.userid){
                creatorCondition = ` OR created_by = ${req.session.userid} `
            }
            console.log(`SELECT * FROM item WHERE (started_date <= CURRENT_TIME() AND status IN(1,2)) ${creatorCondition} `)
            con.query(`SELECT * FROM item WHERE (started_date <= CURRENT_TIME() AND status IN(1,2)) ${creatorCondition} `, (err, rows)=>{
                if(err){
                    return resolve({ code:500, status:'error' })
                }
                return resolve({ code:200, status:'success', data:rows })
            })
        });
    }catch (err){
        return reject({message:'Check User Exist', err})
    }
}

const detailItem = (id) => {
    try{
        return new Promise( (resolve, reject)=> {
            con.query(`SELECT i.*, u.username FROM item i INNER JOIN users u ON i.created_by = u.id WHERE i.id = ${id} `, (err, rows)=>{
                if(err){
                    return resolve({ code:500, status:'error' })
                }
                return resolve({ code:200, status:'success', data:rows })
            })
        });
    }catch (err){
        return reject({message:'Check User Exist', err})
    }
}

const listBidByItem = (id) => {
    try{
        return new Promise( (resolve, reject)=> {
            con.query(`SELECT ib.id, ib.bid_offer, ib.notes, ib.status, u.username FROM item_bid ib INNER JOIN item i ON i.id = ib.item_id INNER JOIN users u ON ib.user_id = u.id WHERE i.id = ${id} ORDER BY ib.id DESC`, (err, rows)=>{
                if(err){
                    return resolve({ code:500, status:'error' })
                }
                return resolve({ code:200, status:'success', data:rows })
            })
        });
    }catch (err){
        return reject({message:'Check User Exist', err})
    }
}

const deleteItem = (payload, table, ref_field, id) => {
    try{
        return new Promise( (resolve, reject)=> {
            con.query(`UPDATE item SET status = 3 WHERE id = '${id}' `, (err, __rows)=>{
                if(err){
                    return resolve({ code:500, status:'error' })
                }
                return resolve({ code:200, status:'success' })
            })
        });
    }catch (err){
        return reject({message:'Check User Exist', err})
    }
}

///////
module.exports = {
    selectQuery,
    getItemList,
    detailItem,
    listBidByItem,
    deleteItem
}