const express 			= require('express');
const router  			= express.Router();
const moment            = require('moment')
const bcrypt            = require('bcrypt');
const salt              = bcrypt.genSaltSync(10);
const reply             = require('../helpers/response')
const mailHelper        = require('../helpers/mailHelper')
const encryptionHelper  = require('../helpers/encryptionHelper')
const authModel         = require('../model/authModel');

const { request } = require('../../app');

const checkSession = async (req, res, payload) => {
    if(!req.session.userid){
        req.session.userid = payload.id
        await authModel.updateLastLogin(payload)
    }else{
        await authModel.updateLastLogout(payload)
        req.session.destroy()
    }
    return true;
}

const authValidation = (req, res) => {
    // check session
    let userID;
    if(req.session.userid){
        userID = req.session.userid
    }else{
        const decryptedToken = encryptionHelper.decryptPayload(req.headers.authorization)
        if(decryptedToken){
            userID = decryptedToken.id
        }
    }
    if(!userID){
        return reply.send(res, {code:401})
    }
    req = { ...req, auth: userID }
}

const checkUserLogin = async (req, res) => {
    try{
        const clientIp      = req.socket.remoteAddress
        const username      = req.body.email
        const password      = req.body.password
        const checkDBUser   = await authModel.getLoginMandatory(username)
        if(checkDBUser){
            bcrypt.compare(password, checkDBUser.password, async (__err, valid) => {
                if(valid){
                    const expireTime    = parseInt(moment().format('x')) + (30*60*1000)
                    const payloadData = {
                        id: checkDBUser.id,
                        secretID: encryptionHelper.encryptString(checkDBUser.id),
                        username: checkDBUser.username,
                        fullname: checkDBUser.email,
                        ip:clientIp
                    }
                    const dataToEncrypt = { profile:payloadData, expireTime }
                    const response = {
                        status: 'LOGIN_SUCCESS',
                        token: encryptionHelper.encryptPayload(dataToEncrypt, 30) // 30 minutes
                    };
                    await checkSession(req, res, payloadData)
                    return reply.send(res, response)
                }else{
                    return reply.sendMessage(res, 'INVALID_PASSWORD')
                }
            })
        }else{
            return reply.sendMessage(res, 'USER_NOT_FOUND')
        }
    }
    catch(err){
        res.status(500).send(err)
    }
}

const checkUserLogout = async (req, res) => {
    try{
        const userid = req.session.userid
        const checkDBUser   = await authModel.getLoginMandatory(userid)
        if(checkDBUser){
            const payloadData = {
                id: req.session.userid,
                last_sign_in_at: checkDBUser.current_sign_in_at,
                last_sign_in_ip: checkDBUser.current_sign_in_ip,
                current_sign_in_at: null,
                current_sign_in_ip: null
            }

            const response = { status: 'LOGOUT_SUCCESS' };
            checkSession(req, res, payloadData)
            return reply.send(res, response)
        }else{
            return reply.sendMessage(res, 'USER_NOT_FOUND')
        }
    }
    catch(err){
        res.status(500).send(err)
    }
}

const checkExistingUser = async (req) => {
    try{
        const checkAccount = await authModel.isUserExist(req.body)
        let response = true
        if(!checkAccount.status){
            response = false
        }
        return response
    }catch(error){
        throw new Error(error)
    }
}

const submitSelfRegister = async (req, res) => {
    try{
        const password = bcrypt.hashSync(req.body.password, salt)
        const username = req.body.username.replaceAll(' ', '')
        const dataUser = {
            username:   username,
            email:      req.body.email,
            password:   password,
            created_date: moment().format('YYYY-MM-DD HH:mm:ss')
        }
       
        const isUserExist = await authModel.isUserExist(dataUser)
        if(isUserExist.status){
            return isUserExist;
        }
        const response = await authModel.insertUser(dataUser)
        return response;
    }catch(error){
        console.log(error)
        throw new Error(error)
    }
}

const checkTokenActivation = async(req, res)=> {
    try{
        const token = req.query.token.split(' ').join('+')
        const checkTokenLog = await authModel.checkTokenLog(token)
        if(checkTokenLog === []){
            return reply.sendMessage(res, 'INVALID_TOKEN')
        }
        
        // Decrypt Token
        const decryptToken = engineCrypt.decrypt(token)
        if(!decryptToken) {
            throw new Error("INVALID_TOKEN_OR_EXPIRED")
        }

        // Compare DB and Decrypted Token
        if(checkTokenLog.username === decryptToken.username && checkTokenLog.email === decryptToken.email && checkTokenLog.phone === decryptToken.phone){
            return authModel.activationSuccess(decryptToken.username, decryptToken.email)
        }
        throw new Error("INVALID_TOKEN_OR_EXPIRED")
    }catch(error){
        throw new Error(error)
    }
}

const generateOTP = () => {
    let otp = Math.floor((Math.random() * 10))
            otp = `${otp}${Math.floor((Math.random() * 10))}`
            otp = `${otp}${Math.floor((Math.random() * 10))}`
            otp = `${otp}${Math.floor((Math.random() * 10))}`
            otp = `${otp}${Math.floor((Math.random() * 10))}`
    return otp
}

const sendOTP = async (req, _res) => {
    try{
        const otp = generateOTP();

        // Send OTP to Email
        await mailHelper.sendOTPEmail(req.body, otp)
        const obj = {
            email: req.body.email,
            otp_code:   otp,
            create_date: moment().format('YYYY-MM-DD HH:mm:ss')
        }
        const encryptedToken = encryptionHelper.encryptPayload(obj, 2) // 2 minutes
        obj.token = encryptedToken
        const response = await authModel.updatePasswordToken(obj);
        response.token = encryptedToken
        return response;
    }catch(error){
        throw new Error(error)
    }
}

const validateOTP = async (req, _res) => {
    try{
        const otp    = req.body.otp
        const decryptedToken = encryptionHelper.decryptPayload(req.body.token)
        if(decryptedToken === null){
            throw new Error("INVALID_OTP_OR_EXPIRED")
        }

        const tokenOTP      = decryptedToken.otp_code
        const getDetailOTP  = await authModel.getUserOTP(decryptedToken);
        if(otp !== tokenOTP){
            throw new Error("INVALID_OTP")
        }
        
        await authModel.updateResetPasswordLog(otp);
        const tokenPayload = {
            email: getDetailOTP.email
        }
        const responseToken = encryptionHelper.encryptPayload(tokenPayload, 2) // 2 minutes
        return {token: responseToken};
    }catch(error){
        throw new Error(error)
    }
}

const submitResetPassword = async (req, _res) => {
    try{
        if(req.body.password !== req.body.confirm_password){
            throw new Error("Password doesn't match")
        }
        const decryptedToken    = encryptionHelper.decryptPayload(req.body.token);
        const email             = decryptedToken.email
        if(decryptedToken === null){
            throw new Error("INVALID_OTP_OR_EXPIRED")
        }
        const newPassword          = bcrypt.hashSync(req.body.password, salt)
        const payloadUpdate = {
            password: newPassword,
            email
        }
        
        // Update User to DB
        return await authModel.updatePassword(payloadUpdate)
    }catch(error){
        throw new Error(error)
    }
}

const Autorization = async (req, res) => {
    try{
        let headers = JSON.stringify(req.headers)
            headers = JSON.parse(headers)
        if(headers.authorization){
            const decryptedToken = encryptionHelper.decryptPayload(headers.authorization)
            if(decryptedToken === null || decryptedToken.expireTime < moment().format('x')){
                return reply.Unauthorized(req, res)
            }
            return Promise.resolve(decryptedToken.profile);
        }
        return reply.Unauthorized(req, res)
    }catch(error){
        return reply.Unauthorized(req, res)
    }
}

module.exports = {
    authValidation,
    checkExistingUser,
    submitSelfRegister,
    checkUserLogin,
    checkUserLogout,
    checkTokenActivation,
    sendOTP,
    validateOTP,
    submitResetPassword,
    Autorization
}