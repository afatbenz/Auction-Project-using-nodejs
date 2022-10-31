const nodemailer        = require("nodemailer");
const generalConfig     = require('../../assets/generalConfig.json');
const authModel         = require('../model/authModel');

const transporter       = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: generalConfig.defaultEmail,        
      pass: generalConfig.defaultEmailPassword,
    },
});

const sendMail = async (data, mailMessage) => {
    const mailData = {
        from:       generalConfig.defaultEmail,     // sender address
        to:         data.email,
        subject:    mailMessage.subject,
        text:       mailMessage.text,
        html:       mailMessage.messages
    }
    transporter.sendMail(mailData, async (err, info)=> {
        console.log(err, info)
        if(err){
            console.log("Error Send Email")
            return {status:'failed', message:'failed sent to '+mailData.to}
        }
        return {status:'success', message:'success sent to '+mailData.to}
    });
}

const sendVerificationEmail = async (data, token) => {
    const mailMessage = {
        subject:    "Welcome to Travego",
        text:       "Welcome Message",
        messages:   "Hi "+data.fullname+"! Please open this link below to activate your accoubt http://localhost:3100/api/auth/verification?token="+token
    }
    await sendMail(data, mailMessage)
}

const sendOTPEmail = async (data, otp) => {
    const mailMessage = {
        subject:    "Reset Password - OTP",
        text:       "Welcome Message",
        messages:   "This is your OTP "+otp
    }
    await sendMail(data, mailMessage)
}

module.exports = {
    sendMail,
    sendVerificationEmail,
    sendOTPEmail
}