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
7. `/api/item/submit` [POST] Creating items to be auctioned
8. `/api/item/list` [GET] List of auction
9. `/api/item/detail/{id}` [GET] Detail Auction
10. `/api/item/update` [POST] Update auctioned items
11. `/api/item/delete` [POST] Delete auctioned items
12. `/api/wallet/balance` [GET] Get Wallet Balance
13. `/api/wallet/register` [POST] Registering Wallet Account
14. `/api/wallet/transaction` [POST] Topup Wallet
15. `/api/wallet/history` [GET] Get Transaction History
16. `/api/bid/process` [POST] To submit a bid
17. `/api/bid/accept` [POST] To accept bid
18. `/api/bid/confirm` [POST] To confirm and purchase bid
19. `/api/bid/cancel` [POST] To cancel bid
20. `/api/item/activate/{itemID}` [GET] activate item to open bid



## Do you need a tutorial to run the service?
OK, follow these steps
1. Create database `CREATE DATABASE jitera` and then `USE jitera`
2. Please download the sql file, [here](https://github.com/afatbenz/Auction-Project-using-nodejs/blob/main/db/jitera.sql). And run the sql in your MySql
3. Clone this repository
4. Run command `npm install` to install node module package
5. Run command `nodemon start www` to start your service
6. The service will running default on port 3100


## Want an example of using the API?
Yes, you just need to import our postman collection. You can get it [here](https://github.com/afatbenz/Auction-Project-using-nodejs/blob/main/db/Jitera.postman_collection.json).
You only need to change the payload, query and parameters that have been provided

## What's not perfect?
There are many points that are not perfect. For example, email notifications that are still blocked by gmail and cron to check items automatically have not been provided.
To get around the auction activation cron, we can use the API `/api/item/activate/{itemID}`

For problems sending OTP code email, the sent OTP can be seen in the database.