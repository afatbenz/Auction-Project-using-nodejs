const {req, res} = require('express')
const con     = require('../../config/db');
const moment  = require('moment');
const { reject } = require('lodash');

const insertQuery = (payload, table) => {
    try{
        return new Promise( (resolve, reject)=> {
            con.query(`INSERT INTO ${table} SET ?`, payload, (err, __rows)=>{
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

const updateQuery = (payload, table, ref_field, id) => {
    try{
        return new Promise( (resolve, reject)=> {
            con.query(`UPDATE ${table} SET ? WHERE ${ref_field} = '${id}' `, payload, (err, __rows)=>{
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

///////
module.exports = {
    insertQuery,
    updateQuery,
    selectQuery
}