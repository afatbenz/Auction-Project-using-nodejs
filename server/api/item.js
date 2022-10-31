const express           = require('express');
const router            = express.Router();
const reply             = require('../helpers/response')
const generalHelper     = require('../helpers/generalHelper')
const itemHelper        = require('../helpers/itemHelper')
const moment            = require('moment')
const validationHelper  = require('../helpers/validationHelper');

const checkPublishTime = (startedtime) =>{
    const date = moment().add(1, 'hour')
    return moment(startedtime).isAfter(date, 'hour');
}

const submitItem = async (req, res)=> {
    try{
        generalHelper.authValidation(req, res)
        const { error } = validationHelper.validateSubmitItem(req.body)
        if (error) return reply.InvalidRequest(res, error)

        const publishTimeValid = checkPublishTime(req.body.started_date)
        if(!publishTimeValid){
            return reply.badRequest(res, "Publish time at least 1 hour from now")
        }

        const response = await itemHelper.submitItem(req, res)
        return reply.send(res, response)
    }catch(err){
        return reply.errorInternalServer(res,err)
    }
}

const getListItem = async (req, res)=> {
    try{
        generalHelper.authValidation(req, res, true)
        const getListItem = await itemHelper.getListItem(req)
        
        return reply.send(res, getListItem)
    }catch(err){
        return reply.errorInternalServer(res,err)
    }
}

const updateItem = async (req, res)=> {
    try{
        generalHelper.authValidation(req, res)
        const { error } = validationHelper.validateUpdateItem(req.body)
        if (error) return reply.InvalidRequest(res, error)

        const publishTimeValid = checkPublishTime(req.body.started_date)
        if(!publishTimeValid){
            return reply.badRequest(res, "Publish time at least 1 hour from now")
        }

        const response = await itemHelper.updateItem(req, res)
        return reply.send(res, response)
    }catch(err){
        return reply.errorInternalServer(res,err)
    }
}

const getDetailItem = async (req, res)=> {
    try{
        generalHelper.authValidation(req, res, true)
        const { error } = validationHelper.validateGetDetail(req.params)
        if (error) return reply.InvalidRequest(res, error)

        const response = await itemHelper.getDetailItem(req, res)
        return reply.send(res, response)
    }catch(err){
        return reply.errorInternalServer(res,err)
    }
}

const deleteItem = async (req, res)=> {
    try{
        generalHelper.authValidation(req, res)
        const { error } = validationHelper.validateDeleteItem(req.body)
        if (error) return reply.InvalidRequest(res, error)

        const response = await itemHelper.deleteItem(req, res)
        return reply.send(res, response)
    }catch(err){
        return reply.errorInternalServer(res,err)
    }
}

const activateItem = async (req, res)=> {
    try{
        generalHelper.authValidation(req, res)
        const { error } = validationHelper.validateOpenBid(req.params)
        if (error) return reply.InvalidRequest(res, error)

        const response = await itemHelper.activateItem(req, res)
        return reply.send(res, response)
    }catch(err){
        return reply.errorInternalServer(res,err)
    }
}

router.post('/submit', submitItem)
router.get('/list', getListItem)
router.post('/update', updateItem)
router.get('/detail/:itemID', getDetailItem)
router.post('/delete', deleteItem)
router.get('/activate/:itemID', activateItem)

module.exports = router;