const {req, res} = require('express')
const con     = require('../../config/db');
const moment  = require('moment');
const { reject } = require('lodash');

const getLoginMandatory = (credential) => {
    try{
        return new Promise( (resolve, reject)=> {
            con.query(`SELECT id, email, password, username, sign_in_count, current_sign_in_at, current_sign_in_ip FROM users WHERE email = '${credential}' OR id = '${credential}' `, (err, result)=>{
                if(err){
                    return reject(err.code)
                }
                if(result.length > 0){
                    const countLogin = result[0].sign_in_count ? result[0].sign_in_count + 1 : 1
                    queryUpdate({sign_in_count: countLogin }, 'users', 'id', result[0].id)
                    return resolve(result[0])    
                }else{
                    return reject('USER_NOT_FOUND')
                }
            })
        });
    }catch (err){
        reject({message:'Check User Exist', err})
    }
}

const isUserExist = (obj) => {
    try{
        return new Promise( (resolve, reject)=> {
            con.query(`SELECT username, email FROM users WHERE email = '${obj.email}' OR username = '${obj.username}' `, (err, result)=>{
                if(err){
                    return reject(err.code)
                }
                if(result.length === 0){
                    return resolve({status:false, message:'User Not Exist'})
                }else{
                    return resolve({status:true, message:'User Already Exist'})
                }
            })
        });
    }catch (err){
        reject({message:'Check User Exist', err})
    }
}

const queryUpdate = (payload, table, ref_field, id) => {
    try{
        return new Promise( (resolve, reject)=> {
            con.query(`UPDATE ${table} SET ? WHERE ${ref_field} = '${id}' `, payload, (err, __rows)=>{
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

const updateLastLogin = async (dataObject) => {
    const payload = {
        current_sign_in_at: moment().format('YYYY-MM-DD HH:mm:ss'),
        current_sign_in_ip: dataObject.ip
    }
    const callQuery = await queryUpdate(payload, 'users', 'id', dataObject.id)
    return callQuery;
}

const updateLastLogout = async (dataObject) => {
    const payload = {
        last_sign_in_at: dataObject.last_sign_in_at,
        last_sign_in_ip: dataObject.last_sign_in_ip,
        current_sign_in_at: dataObject.current_sign_in_at,
        current_sign_in_ip: dataObject.current_sign_in_ip
    }
    const callQuery = await queryUpdate(payload, 'users', 'id', dataObject.id)
    return callQuery;
}

const updatePasswordToken = async (dataObject) => {
    const { otp_code, email, token } = dataObject
    const payload = {
        reset_password_token: token,
        reset_password_sent_at: moment().format('YYYY-MM-DD HH:mm:ss'),
        otp_code
    }
    const callQuery = await queryUpdate(payload, 'users', 'email', email)
    return callQuery;
}

const updatePassword = async (dataObject) => {
    const { password, email } = dataObject
    const payload = {
        password
    }
    const callQuery = await queryUpdate(payload, 'users', 'email', email)
    return callQuery;
}

const getLastOTP = (email) => {
    return new Promise( (resolve, reject)=> {
        con.query("SELECT email, otp_code FROM users WHERE email = '"+email+"' ", (err, rows)=>{
            if(err){
                reject(err.code)
            }
            if(rows.length>0){
                resolve(rows[0])
            }else{
                resolve([])
            }
        })
    });
}

const getUserOTP = (token) => {
    const {otp_code, email} = token
    return new Promise( (resolve, reject)=> {
        con.query(`SELECT email, otp_code FROM users WHERE email = '${email}' AND otp_code = '${otp_code}' `, (err, rows)=>{
            if(err){
                reject(err.code)
            }
            if(rows.length>0){
                resolve(rows[0])
            }else{
                resolve([])
            }
        })
    });
}

const updateResetPasswordLog = (otp) => {
    return new Promise( (resolve, reject)=> {
        con.query("UPDATE users SET reset_password_token = NULL, reset_password_sent_at = NULL, otp_code = NULL WHERE otp_code = '"+otp+"' ORDER BY id DESC LIMIT 1", (err, __rows)=>{
            if(err){
                reject(err.code)
            }
            resolve({ status:'success', message:'OTP Send Successfully!' })
        })
    });
}
///////

const insertUser = (obj) => {
    try{
        return new Promise( (resolve, reject)=> {
            con.query("INSERT INTO users SET ? ", obj, function(err){
                if(err){
                    reject(err.code)
                }
                resolve({ status:'success', message:'Account Registered!' })
            })
        });
    }catch (err){
        reject({message:'SQL Error', err})
    }
}

const checkTokenLog = (token) => {
    return new Promise( (resolve, reject)=> {
        con.query("SELECT username, email, phone FROM the_registration_log WHERE token_verification = '"+token+"' ", (err, rows)=>{
            if(err){
                reject(err.code)
            }
            if(rows.length>0){
                resolve(rows[0])
            }else{
                resolve([])
            }
        })
    });
}


module.exports = {
    getLoginMandatory,
    isUserExist,
    updatePasswordToken,
    getUserOTP,
    insertUser,
    updateLastLogout,
    checkTokenLog,
    getLastOTP,
    updateResetPasswordLog,
    updatePassword,
    updateLastLogin
}