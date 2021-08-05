// Class: 1B05
// Admission Number: p2021391
// Name: Lim Chong Shan

console.log("-------------------------------");
console.log("ADES > model > category.js");
console.log("-------------------------------");


//------------------------------------------
// imports
//------------------------------------------
var db = require('../controller/databaseConfig.js');

//------------------------------------------
// objects / functions
//------------------------------------------
var catDB = {
    insert: function (user, callback) {
        var catname = user.catname;
        var description = user.description;

        var conn = db.getConnection();

        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                console.log("Connected!");

                var sql = `
                    INSERT INTO
                        category(catname, description)
                    VALUES
                        (?, ?);
                `;

                conn.query(sql, [catname, description], function (err, result) {
                    conn.end();

                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    }
                    else {
                        return callback(null, result);
                    }
                });
            }
        });
    }
}

//------------------------------------------
// exports
//------------------------------------------
module.exports = catDB;