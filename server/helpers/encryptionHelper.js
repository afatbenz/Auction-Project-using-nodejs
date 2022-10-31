const express 			= require('express');
const router  			= express.Router();
const moment            = require('moment')
const encrypter         = require('object-encrypter');
const bcrypt            = require('bcrypt');
const salt              = bcrypt.genSaltSync(10);
const Cryptr            = require('cryptr');

const Config            = require('../../assets/generalConfig.json');
const engineCrypt       = encrypter(Config.secretKey, {ttl: true});
const cryptr            = new Cryptr(Config.secretKey);

const encryptPayload = (payload, minutes)=>{
    const expiryTime = minutes * 60 * 1000
    const encrypted = engineCrypt.encrypt(payload, expiryTime)
    return encrypted
}

const decryptPayload = (payload)=>{
    payload = payload ? payload.replaceAll(' ', '+') : payload
    const encrypted = engineCrypt.decrypt(payload)
    return encrypted
}

const encryptString = (payload)=>{
    return cryptr.encrypt(payload)
}

const decryptString = (payload)=>{
    return cryptr.decrypt(payload)
}

module.exports = { 
    encryptPayload,
    decryptPayload,
    encryptString,
    decryptString
}