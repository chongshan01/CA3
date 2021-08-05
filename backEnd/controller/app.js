// Class: 1B05
// Admission Number: p2021391
// Name: Lim Chong Shan

console.log("-------------------------------");
console.log("ADES > backEnd > controller > server.js");
console.log("-------------------------------");

//------------------------------------------
// imports
//------------------------------------------
const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const cors = require('cors');

var User = require('../model/user.js');
// var Post = require('../model/post.js');
var Game = require('../model/game.js');
var review = require('../model/review.js');
var category = require('../model/category.js');

var jwt = require('jsonwebtoken');
var JWT_SECRET = require('../config');

const isLoggedInMiddleware = require("../auth/isLoggedInMiddleware");

//------------------------------------------
// Middleware functions
//------------------------------------------
/**
 * prints useful debugging information about an endpoint
 * we are goig to service
 * 
 * @param {object} req
 *   request object
 * 
 * @param {object} res
 *   response object
 * 
 * @param {function} next
 *   reference to the next function to call
 */
var printDebugInfo = function (req, res, next) {
    console.log();
    console.log("---------[ Debug Info ]---------");

    console.log("Servicing " + req.url + "...");

    console.log("> req.params: " + JSON.stringify(req.params));
    console.log("> req.body: " + JSON.stringify(req.body));

    console.log("------[ Debug Info Ends ]------");
    console.log();

    next();
}

var urlEncodedParser = bodyParser.urlencoded({ extended: false });
var jsonParser = bodyParser.json();

app.options('*', cors());
app.use(cors());

//------------------------------------------
// MF Configurations
//------------------------------------------
app.use(urlEncodedParser);
app.use(jsonParser);

//------------------------------------------
// endpoints
//------------------------------------------
app.get('/', printDebugInfo, (req, res) => {
    console.log("GET > '/' > I'm here (L08)!");

    res.statusCode = 200;
    res.send("GET > '/' > I'm here (L08)!");
    res.end();
});

//------------------------------------------
// end points - User
//------------------------------------------
app.post("/login", (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    // console.log("Username: " + username);
    // console.log("Password: " + password);

    if (username == null || username == "" || password == null || password == "") {
        res.status(400).send("Invalid Login Details.")
    }
    User.verify(
        username,
        password,
        (error, user) => {
            if (error) {
                res.status(500).send();
                return;
            }
            if (user === null) {
                res.status(401).send();
                return;
            }

            const payload = {
                user_id: user.userid,
                type: user.type
            };

            jwt.sign(
                // (1) Payload
                payload,
                // (1) Secret Key
                JWT_SECRET,
                // (1) Algorithm
                { algorithm: "HS256" },
                // (1) response handler (callback function)
                (error, token) => {
                    if (error) {
                        console.log(error);
                        res.status(401).send();
                        return;
                    }

                    // console.log("----------------------------------------");
                    console.log(payload);
                    res.status(200).send({
                        token: token,
                        user_id: user.userid
                    });
                })
        });
});

//------------------------------------------
// end points - Game
//------------------------------------------
app.get('/games', printDebugInfo, isLoggedInMiddleware, function (req, res) {
    Game.findAll(function (err, result) {
        if (!err) {
            res.send(result);
        }
        else {
            res.status(500).send("Some error");
        }
    });
});

app.post('/search-game', printDebugInfo, isLoggedInMiddleware, function (req, res) {
    var title = req.body.title;
    var platform = req.body.platform;
    var price = req.body.price;
    if (isNaN(price)) {
        res.status(400).send("Please enter a number");
        return;
    }

    Game.search(title, platform, price, function (err, result) {
        if (!err) {
            if (result.length == 0) {
                res.send("No games found");
            }
            else {
                res.send(result);
            }
        }
        else {
            res.status(500).send("Some error");
        }
    });

});

app.get('/gameinfo/:gameid', printDebugInfo, isLoggedInMiddleware, function (req, res) {
    var gameid = req.params.gameid;

    if (isNaN(gameid)) {
        res.status(400).send("Invalid Game ID!");
    }

    Game.findByID(gameid, function (err, result) {
        if (!err) {
            if (result == null) {
                res.status(200).send("No games found");
            }
            else {
                res.status(200).send(result);
            }
        }
        else {
            res.status(500).send("Some error");
        }
    });

});

app.post('/game-add', printDebugInfo, printDebugInfo, isLoggedInMiddleware, function (req, res) {

    if (req.decodedToken.type != "Admin") {
        console.log("Hey! What do you think you are doing?");
        res.status(401).send("Stop it! You are not an admin so its illegal!");
        return;
    }
    var data = {
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        platform: req.body.platform,
        catename: req.body.Category,
        year: req.body.year
    };

    Game.insert(data, function (err, result) {
        if (!err) {
            res.status(201).send(result);
        }
        else {
            if (err.code == "ER_DUP_ENTRY") {
                res.status(422).send("Game already exists");
            } else {
                res.status(500).send("Unknown error");
            }
        };
    });

});

//------------------------------------------
// end points - Review
//------------------------------------------
app.post('/gameinfo/:gameid', printDebugInfo, isLoggedInMiddleware, function (req, res) {
    if (req.body.rating == "" || req.body.rating == null) {
        req.body.rating = "0";
    }

    var gid = req.params.gameid;

    var data = {
        uid: req.body.uid,
        content: req.body.content,
        rating: req.body.rating,
    };

    if (req.decodedToken.user_id != req.body.uid) {
        res.status(403).send("Unauthorized request to fetch posts");
        return;
    }

    if (isNaN(req.body.uid)) {
        res.status(400).send("Invalid user id!");
        return;
    }

    if (isNaN(gid)) {
        res.status(400).send("Invalid game id!");
        return;
    }

    console.log(req.decodedToken);
    console.log("Rating = " + data.rating);
    // console.log(req.decodedToken.user_id);
    console.log(req.decodedToken.type);

    if (req.body.uid != req.decodedToken.user_id) {
        res.status(403).send("Who are you?");
        return;
    }
    if (req.decodedToken.type == "Admin") {
        res.status(401).send("You are an admin, so no adding reviews for you!");
        return;
    }

    review.insert(gid, data, function (err, result) {
        if (!err) {
            var output = {
                "reviewid": result.insertId,
            };

            res.status(201).send(output);
        }
        else {
            if (err.code == "ER_NO_REFERENCED_ROW_2" && err.sqlMessage == "Cannot add or update a child row: a foreign key constraint fails (`bedassignment`.`review`, CONSTRAINT `fkuid` FOREIGN KEY (`uid`) REFERENCES `user` (`userid`) ON DELETE CASCADE ON UPDATE CASCADE)") {
                res.status(404).send("No such user");
            } else if (err.code == "ER_NO_REFERENCED_ROW_2" && err.sqlMessage == "Cannot add or update a child row: a foreign key constraint fails (`bedassignment`.`review`, CONSTRAINT `fkgid` FOREIGN KEY (`gid`) REFERENCES `game` (`gameid`) ON DELETE CASCADE ON UPDATE CASCADE)") {
                res.status(404).send("No such game");
            }
            res.status(500).send("Unknown error");
        };
    });

});

//------------------------------------------
// end points - Category
//------------------------------------------
app.post('/cat-add', printDebugInfo, printDebugInfo, isLoggedInMiddleware, function (req, res) {

    if (req.decodedToken.type != "Admin") {
        console.log("Hey! What do you think you are doing?");
        res.status(401).send("Stop it! You are not an admin so its illegal!");
        return;
    }

    var data = {
        catname: req.body.catname,
        description: req.body.description,
    };

    if ((req.body.catname == null || req.body.catname == "") || (req.body.description == null || req.body.description == "")) {
        return;
    }

    category.insert(data, function (err, result) {
        if (!err) {
            var output = {
                "catid": result.insertId
            }
            res.status(201).send(output);
        }
        else {
            if (err.code == "ER_DUP_ENTRY") {
                res.status(422).send("Category already exists");
            } else {
                res.status(500).send("Unknown error");
            }
        };
    });

});

//------------------------------------------
// exports
//------------------------------------------
module.exports = app;