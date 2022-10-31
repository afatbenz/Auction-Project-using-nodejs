const { exist } = require('@hapi/joi');
const express 			= require('express');
const router  			= express.Router();
const request             = require('request');

const cdate   = new Date();
const csecond = cdate.getSeconds();
const cminutes= cdate.getMinutes();

const year    = cdate.getFullYear().toString();
const month   = (cdate.getMonth() + 101).toString().substring(1);
const day     = (cdate.getDate() + 100).toString().substring(1);
const rand    = cminutes + year + month + day + csecond;

const transactionId = ()=> {
    return "SVC"+rand+Math.floor((Math.random() * 100000) + 1)
}

const send = (res, param) => {
    const {code} = param
    let codeResponse = 200
    if(code){
        codeResponse = code
    }
    if(code && code === 401){
        res.status(401).send({status:401, message:'Unauthorized'})
    }
    const response = {
        status:     codeResponse, 
        message:    "success"
    }
    if(param && param.message && code){
        if(code === 400){
            response.message = param.message.replaceAll(' ', '_').toUpperCase()
        }else{
            response.message = param.message
        }
    }else{
        response.data = param
    }
    response.transactionID = transactionId()

    if (param && param.length === 0){
        response.status = 201
        response.message = "DATA_NOT_FOUND"
    }

    res.status(codeResponse).send(response)
}

const InvalidRequest = (res, param) => {
    const response = {
        status:     400, 
        message:    "Invalid Parameter",
        description: param.details[0].message
    }
    res.status(400).send(response)
}

const errorInternalServer = (res, err)=>{
    const {code} = err;
    let statusCode = 500
    let messaege = "Internal Server Error"
    if(code === 401){
        statusCode = 401
        messaege = "Unauthorized"
    }

    let description = err.message || messaege

    if(description !== '' && code !== 401){
        description = description.replace('Error: ', ' ')
        res.status(400).send({status:400, message:description, transactionID:transactionId()})    
    }else{
        res.status(500).send({status:statusCode, message: description})
    }
}

const badParameter = (res, param)=>{
    let parameters = ''
    if(param){
        parameters = param.toUpperCase().split(' ').join('_')+'_NOT_FOUND'
    }
    res.status(400).send({status:400, message:"Missing Mandatory Paramareters", description:parameters})
}

const sendMessage = (res, msg) => {
    const response = {
        status:     201,
        message:    msg
    }
    response.transactionID = transactionId()

    res.status(201).send(response);
}

const missing   = (res, reqHeder)=>{
    res.status(400).send({message:`${reqHeder} is required`})
}

const badRequest   = (res, msg)=>{
    const response = {
        status:     400,
        message:    msg
    }
    response.transactionID = transactionId()

    res.status(400).send(response)
}

const Unauthorized   = (req, res)=>{
    const response = {
        status:     401,
        message:    'Unauthorized'
    }
    response.transactionID = transactionId()

    res.status(401).send(response)
}

module.exports = {
    send,
    missing,
    errorInternalServer,
    badParameter,
    badRequest,
    sendMessage,
    transactionId,
    InvalidRequest,
    Unauthorized
}