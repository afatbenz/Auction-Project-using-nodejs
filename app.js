const createError 	  = require('http-errors');
const express 		  = require('express');
const bodyParser      = require('body-parser');
const path 	          = require('path');
const cookieParser 	  = require('cookie-parser');
const session         = require('express-session');
const mysql           = require('mysql');               //// Add SQL
const app             = express();
const cron            = require('node-cron');
const reply           = require('./server/helpers/response')
const moment          = require('moment')
const cors = require('cors');

app.disable('x-powered-by');

app.use(bodyParser.json());
app.use(cors())
app.use(express.json())
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'jitera123',
    name: 'jiteraSecret',
    cookie: {
        sameSite: true,
        maxAge: 6000000
    },
}))

const indexRouter       = require('./server/api/index');
const authRouter        = require('./server/api/auth');
const itemRouter        = require('./server/api/item');
const walletRouter      = require('./server/api/wallet');
const bidRouter         = require('./server/api/bid');

app.use('/api', indexRouter);
app.use('/api/auth', authRouter);
app.use('/api/item', itemRouter);
app.use('/api/wallet', walletRouter);
app.use('/api/bid', bidRouter);

app.use((err, res)=> {
    if(err){
        res.send({status:404, message:"REQUEST_NOT_FOUND", transactionID:reply.transactionId()})
    }
});

   
module.exports = app;