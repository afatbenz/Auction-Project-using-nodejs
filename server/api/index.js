const express           = require('express');
const router            = express.Router();
const reply             = require('../helpers/response')

router.get('/sys', async (req, res)=> {
    try{
        return reply.send(res, "OK")
    }
    catch(error){
        return reply.errorInternalServer(res,error)
    }
})
module.exports = router;