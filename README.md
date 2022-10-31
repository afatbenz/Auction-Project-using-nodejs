# Bidding-With-Nodejs
This is a simple API project for auction. This project covers authentication, auction and digital wallet needs.

## Environment
We are using NodeJS Express v18 and MySql Database.
You can see the list below, what APIs are available

## API List
1. `/api/sys` [GET] To Check API is running 
2. `/api/auth/register/submit` [POST] Register User 
3. `/api/auth/reset/send-otp` [POST] Send OTP to Reset Password
4. `/api/auth/reset/validate-otp` [POST] OTP Validation to Reset Password
5. `/api/auth/reset/submit-password` [POST] Submit New Password
6. `/api/auth/login` [POST] Login to get session and token