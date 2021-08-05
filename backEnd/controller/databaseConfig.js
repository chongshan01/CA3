// Class: 1B05
// Admission Number: p2021391
// Name: Lim Chong Shan

console.log("-------------------------------");
console.log("ADES > controller > databaseConfig.js");
console.log("-------------------------------");

//------------------------------------------
// imports
//------------------------------------------
var mysql = require('mysql');

//------------------------------------------
// objects / functions
//------------------------------------------
var dbconnect = {
    getConnection: function () {
        var conn = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "st0503bed",
            database: "bedassignment"
        });

        return conn;
    }
};

//------------------------------------------
// exports
//------------------------------------------
module.exports = dbconnect;