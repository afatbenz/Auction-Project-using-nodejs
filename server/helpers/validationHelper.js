const express             = require('express');
const router              = express.Router();
const Joi = require('@hapi/joi');

const validateLogin = (data) => {
    const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
    });
    return schema.validate(data);
};

const validateSubmitRegistration = (data) => {
    const schema = Joi.object({
        username: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().required(),
        confirm_password: Joi.string().required(),
    });
    return schema.validate(data);
};

const validateTokenActivation = (data) => {
    const schema = Joi.object({
        token: Joi.string().required()
    });
    return schema.validate(data);
};

const validateForgotPassword = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(5).required()
    });
    return schema.validate(data);
};

const validateResetPasswordOTP = (data) => {
    const schema = Joi.object({
        otp: Joi.string().required(),
        token: Joi.string().required()
    });
    return schema.validate(data);
};

const validateNewPassword = (data) => {
    const schema = Joi.object({
        password: Joi.string().required(),
        confirm_password: Joi.string().required(),
        token: Joi.string().required(),
    });
    return schema.validate(data);
};

const validateSubmitItem = (data) => {
    const schema = Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        started_price: Joi.string().required(),
        started_date: Joi.string().required(),
    });
    return schema.validate(data);
};

const validateUpdateItem = (data) => {
    const schema = Joi.object({
        itemID: Joi.number().required(),
        title: Joi.string().required(),
        description: Joi.string().required(),
        started_price: Joi.string().required(),
        started_date: Joi.string().required(),
    });
    return schema.validate(data);
};

const validateGetDetail = (data) => {
    const schema = Joi.object({
        itemID: Joi.string().required()
    });
    return schema.validate(data);
};

const validateDeleteItem = (data) => {
    const schema = Joi.object({
        itemID: Joi.number().required()
    });
    return schema.validate(data);
};

const validateRegisterWallet = (data) => {
    const schema = Joi.object({
        fullname: Joi.string().required(),
        nik: Joi.string().required().min(15).max(16)
    });
    return schema.validate(data);
};

const validateTransaction = (data) => {
    const schema = Joi.object({
        walletID: Joi.string().required(),
        keyword: Joi.string().required().valid('topup', 'purchase'),
        credit: Joi.number().required()
    });
    return schema.validate(data);
};

const validateBid = (data) => {
    const schema = Joi.object({
        itemID: Joi.string().required(),
        bid_offer: Joi.number().required(),
        notes: Joi.string().optional()
    });
    return schema.validate(data);
};

const validateAcceptBid = (data) => {
    const schema = Joi.object({
        itemID: Joi.string().required(),
        bidID: Joi.string().required(),
    });
    return schema.validate(data);
};

const validateConfirmBid = (data) => {
    const schema = Joi.object({
        token: Joi.string().required()
    });
    return schema.validate(data);
};

const validateOpenBid = (data) => {
    const schema = Joi.object({
        itemID: Joi.number().required()
    });
    return schema.validate(data);
};
  
module.exports = {
    validateLogin,
    validateSubmitRegistration,
    validateTokenActivation,
    validateForgotPassword,
    validateResetPasswordOTP,
    validateNewPassword,
    validateSubmitItem,
    validateUpdateItem,
    validateGetDetail,
    validateDeleteItem,
    validateRegisterWallet,
    validateTransaction,
    validateBid,
    validateAcceptBid,
    validateConfirmBid,
    validateOpenBid
}