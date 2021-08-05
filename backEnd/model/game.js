// Class: 1B05
// Admission Number: p2021391
// Name: Lim Chong Shan

console.log("-------------------------------");
console.log("ADES > backEnd > model > game.js");
console.log("-------------------------------");

//------------------------------------------
// imports
//------------------------------------------
var db = require('../controller/databaseConfig.js');

//------------------------------------------
// objects / functions
//------------------------------------------
var Game = {
    findAll: function (callback) {
        var conn = db.getConnection();

        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                console.log("Connected!");

                var sql = `
                    SELECT
                        *
                    FROM
                        game
                    ORDER BY
                        price ASC
                `;

                conn.query(sql, [], function (err, result) {
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
    },
    search: function (gameName, platform, price, callback) {
        var conn = db.getConnection();
        console.log(" ----- Search Criteria ----- ");
        console.log("gameName : " + gameName);
        console.log("platform : " + platform);
        console.log("price : " + price);

        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                console.log("Connected!");

                // either of the following works
                var likeSql = `"%` + gameName + `%"`;
                // var likeSql2 = `"%${gameName}%"`;
                var gamePlatform = `"` + platform + `"`;
                var gamePrice = price;
                if (price == null || price == "") {
                    if ((platform == null || platform == "") && (gameName == null || gameName == "")) {
                        var sql1 = `
                    SELECT
                        title,
                        price
                    FROM
                        game
                    ORDER BY
                        price ASC;
                    `;
                    }
                    else if ((platform == null || platform == "") && (gameName != null || gameName != "")) {
                        var sql1 = `
                    SELECT
                        title,
                        price
                    FROM
                        game
                    WHERE
                        title LIKE ${likeSql}
                    ORDER BY
                        price ASC;
                    `;
                    }
                    else if ((gameName == null || gameName == "") && (platform != null || platform != "")) {
                        var sql1 = `
                    SELECT
                        title,
                        price
                    FROM
                        game
                    WHERE
                        platform = ${gamePlatform}
                    ORDER BY
                        price ASC;
                    `;
                    }
                    else {
                        var sql1 = `
                    SELECT
                        title,
                        price
                    FROM
                        game
                    WHERE
                        title LIKE ${likeSql}
                        AND platform = ${gamePlatform}
                    ORDER BY
                        price ASC;
                    `;
                    }
                }
                else {
                    if ((platform == null || platform == "") && (gameName == null || gameName == "")) {
                        var sql1 = `
                    SELECT
                        title,
                        price
                    FROM
                        game
                    WHERE
                        price <= ${gamePrice}
                    ORDER BY
                        price ASC;
                    `;
                    }
                    if ((platform == null || platform == "") && (gameName != null || gameName != "")) {
                        var sql1 = `
                    SELECT
                        title,
                        price
                    FROM
                        game
                    WHERE
                        title LIKE ${likeSql}
                        AND price <= ${gamePrice}
                    ORDER BY
                        price ASC;
                    `;
                    }
                    else if ((gameName == null || gameName == "") && (platform != null || platform == "")) {
                        var sql1 = `
                    SELECT
                        title,
                        price
                    FROM
                        game
                    WHERE
                        platform = ${gamePlatform}
                        AND price <= ${gamePrice}
                    ORDER BY
                        price ASC;
                    `;
                    }
                    else {
                        var sql1 = `
                    SELECT
                        title,
                        price
                    FROM
                        game
                    WHERE
                        title LIKE ${likeSql}
                        AND platform = ${gamePlatform}
                        AND price <= ${gamePrice}
                    ORDER BY
                        price ASC;
                    `;
                    }
                }

                conn.query(sql1, [likeSql, gamePlatform, gamePrice], function (err, result) {
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
    },
    findByID: function (gameid, callback) {
        var conn = db.getConnection();

        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                console.log("Connected!");

                var sql = `
                    SELECT
                        title,
                        platform,
                        catename,
                        year,
                        description,
                    FROM
                        game
                    WHERE
                        gameid = ?
                `;

                conn.query(sql, [gameid], function (err, result) {
                    conn.end();

                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    }
                    else {
                        if (result.length == 0) {
                            return callback(null, null);
                        }
                        else {
                            return callback(null, result);
                        }
                    }
                });
            }
        });
    },
    insert: function (user, callback) {
        var title = user.title;
        var description = user.description;
        var price = user.price;
        var platform = user.platform;
        var catename = user.catename;
        var year = user.year;

        var conn = db.getConnection();
        // var conn = db.createConnection({ multipleStatements: true });

        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                console.log("Connected!");

                var sql = `
                    INSERT INTO
                        game(title, description, price, platform, catename, year)
                    VALUES
                        (?, ?, ?, ?, ?, ?)
                    ;`
                var sql2 = `
                    UPDATE
                        game
                    SET
                        game.categoryid = ( SELECT
                                                category.catid
                                            FROM
                                                category
                                            WHERE
                                                category.catname=game.catename);
                `;

                conn.query(sql, [title, description, price, platform, catename, year], function (err, result) {

                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    }
                    else {
                        if (result.length == 0) {
                            return callback(null, null);
                        }
                        else {
                            return callback(null, result[0]);
                        }
                    }
                });
                conn.query(sql2);
                conn.end();
            }
        });
    },
}

//------------------------------------------
// exports
//------------------------------------------
module.exports = Game;