// Class: 1B05
// Admission Number: p2021391
// Name: Lim Chong Shan

console.log("-------------------------------");
console.log("ADES > backEnd > model > user.js");
console.log("-------------------------------");

//------------------------------------------
// imports
//------------------------------------------
var db = require('../controller/databaseConfig.js');

//------------------------------------------
// objects / functions
//------------------------------------------
var User = {
    verify: function (username, password, callback) {
        var dbConn = db.getConnection();

        dbConn.connect(function (err) {

            if (err) {
                //database connection gt issue!
                console.log(err);
                return callback(err, null);
            }
            else {
                const query = `
                    SELECT
                        *
                    FROM
                        user
                    WHERE
                        username = ?
                        AND password = ?
                `;

                dbConn.query(query, [username, password], (error, results) => {
                    if (error) {
                        callback(error, null);
                        return;
                    }
                    if (results.length === 0) {
                        return callback(null, null);

                    } else {
                        const user = results[0];
                        return callback(null, user);
                    }
                });
            }
        });
    }
};

//------------------------------------------
// exports
//------------------------------------------
module.exports = User;