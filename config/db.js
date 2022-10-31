const mysql = require('mysql');

const con = mysql.createPool({
    connectionLimit: 100,
    host: "localhost",
    user: "root",
    password: "",
    database: "jitera"
});

con.getConnection(function(err, connection) {
    console.log('Connect :)')
});

con.on('connection', function(connection) {
    console.log('DB Connection established');

    connection.on('error', function(err) {
        console.error(new Date(), 'MySQL error', err.code);
    });
    connection.on('close', function(err) {
        console.error(new Date(), 'MySQL close', err);
    });
});

module.exports = con;