// Class: 1B05
// Admission Number: p2021391
// Name: Lim Chong Shan

console.log("-------------------------------");
console.log("ADES > model > review.js");
console.log("-------------------------------");

//------------------------------------------
// imports
//------------------------------------------
var db = require('../controller/databaseConfig.js');

//------------------------------------------
// objects / functions
//------------------------------------------
var review = {
    insert: function (gid, data, callback) {
        var uid = data.uid;
        var content = data.content;
        var rating = data.rating;

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
                        review
                        (uid, gid, content, rating)
                    VALUES
                        (?, ?, ?, ?);
                `;

                conn.query(sql, [uid, gid, content, rating], function (err, result) {
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
};

//------------------------------------------
// exports
//------------------------------------------
module.exports = review;