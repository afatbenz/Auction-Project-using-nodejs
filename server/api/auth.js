const express           = require('express');
const router            = express.Router();
const reply             = require('../helpers/response')
const authHelper        = require('../helpers/authHelper')
const moment            = require('moment')
const validationHelper  = require('../helpers/validationHelper');

const defaultToken = async (req, res)=> {
    try{
        if(!req.body.username && !req.body.email){
            return reply.badParameter(res, 'username or email')
        }else if(!req.body.password){
            return reply.badParameter(res, 'password')
        }
        await authHelper.checkUser(req, res)
    }
    catch(err){
        return reply.errorInternalServer(res,err)
    }
}

const actionLogin = async (req, res)=> {
    try{
        const { error } = validationHelper.validateLogin(req.body)
        if (error) return reply.InvalidRequest(res, error)

        await authHelper.checkUserLogin(req, res)
    }
    catch(err){
        return reply.errorInternalServer(res,err)
    }
}

const actionLogout = async (req, res)=> {
    try{
        const { error } = validationHelper.validateLogin(req.body)
        if (error) return reply.InvalidRequest(res, error)

        await authHelper.checkUserLogout(req, res)
    }
    catch(err){
        console.log("error disini", err)
        return reply.errorInternalServer(res,err)
    }
}

const submitRegister = async (req, res)=> {
    try{
        const { error } = validationHelper.validateSubmitRegistration(req.body)
        if (error) return reply.InvalidRequest(res, error)

        if(req.body.password !== req.body.confirm_password){
            return reply.badRequest(res, "INVALID_PASSWORD")
        }
        const response = await authHelper.submitSelfRegister(req, res)
        return reply.send(res, response)
    }catch(err){
        return reply.errorInternalServer(res,err)
    }
}

const verificationToken = async (req, res)=> {
    try{
        const { error } = validationHelper.validateTokenActivation(req.query)
        if (error) return reply.InvalidRequest(res,error)

        const response = await authHelper.checkTokenActivation(req, res)
        return reply.send(res, response)
    }catch(err){
        return reply.errorInternalServer(res,err)
    }
}

const actionSendOTP = async (req, res)=> {
    try{
        const { error } = validationHelper.validateForgotPassword(req.body)
        if (error) return reply.InvalidRequest(res,error)

        const checkValidity = await authHelper.checkExistingUser(req, res)
        if(!checkValidity){
            return reply.badRequest(res, 'EMAIL_NOT_FOUND')
        }
        // Check Log
        const response = await authHelper.sendOTP(req, res)
        return reply.send(res, response)
    }
    catch(err){
        return reply.errorInternalServer(res,err)
    }
}

const actionValidateOTP = async (req, res)=> {
    try{
        const { error } = validationHelper.validateResetPasswordOTP(req.body)
        if (error) return reply.InvalidRequest(res,error)

        // Check Log
        const response = await authHelper.validateOTP(req, res)
        if(response){
            return reply.send(res, response)
        }
    }
    catch(err){
        return reply.errorInternalServer(res,err)
    }
}

const actionSubmitPassword = async (req, res)=> {
    try{
        const { error } = validationHelper.validateNewPassword(req.body)
        if (error) return reply.InvalidRequest(res,error)

        const response = await authHelper.submitResetPassword(req, res)
        return reply.send(res, response)
    }
    catch(err){
        return reply.errorInternalServer(res,err)
    }
}

router.post('/register/submit', submitRegister)
router.post('/login', actionLogin)
router.post('/logout', actionLogout)
router.get('/verification', verificationToken)
router.post('/get-token', defaultToken)
router.post('/reset/send-otp', actionSendOTP)
router.post('/reset/validate-otp', actionValidateOTP)
router.post('/reset/submit-password', actionSubmitPassword)

module.exports = router;