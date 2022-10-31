const {req, res} = require('express')
const con     = require('../../config/db');
const moment  = require('moment');
const { reject } = require('lodash');

const getBalance = (id) => {
    try{
        return new Promise( (resolve, reject)=> {
            con.query(`SELECT id, balance FROM wallet WHERE user_id = '${id}' `, (err, rows)=>{
                if(err){
                    return resolve({ code:500, status:'error' })
                }
                return resolve({ code:200, status:'success', data:rows  })
            })
        });
    }catch (err){
        return reject({message:'Check User Exist', err})
    }
}

const getHistory = (obj) => {
    try{
        const {id, start_date, end_date, status} = obj
        let condition = ` `
        if(start_date){
            condition = ` AND created_date >= '${start_date}' `
        }
        if(end_date){
            condition = ` AND created_date <= '${end_date}' `
        }

        if(status){
            condition = ` AND status LIKE '%${status.toLowerCase()}$' `
        }

        return new Promise( (resolve, reject)=> {
            console.log(`SELECT id, balance, created_date, label FROM wallet_transaction WHERE user_id = '${id}' ${condition} ORDER BY created_date DESC `)
            con.query(`SELECT id, balance, created_date, label FROM wallet_transaction WHERE user_id = '${id}' ${condition} ORDER BY created_date DESC `, (err, rows)=>{
                if(err){
                    return resolve({ code:500, status:'error' })
                }
                return resolve({ code:200, status:'success', data:rows  })
            })
        });
    }catch (err){
        return reject({message:'Check User Exist', err})
    }
}

module.exports = {
    getBalance,
    getHistory
}