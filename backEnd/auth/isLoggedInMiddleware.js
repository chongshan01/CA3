// Class: 1B05
// Admission Number: p2021391
// Name: Lim Chong Shan

console.log("-------------------------------");
console.log("ADES > backEnd > auth > isLoggedInMiddleware.js");
console.log("-------------------------------");

//------------------------------------------
// imports
//------------------------------------------
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config.js");

//------------------------------------------
// objects / functions
//------------------------------------------
var check = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader === null || authHeader === undefined || !authHeader.startsWith("Bearer ")) {
        res.status(401).send();
        return;
    }

    // decodedToken is the PayLoad that you
    // used earlier to sign the token
    const token = authHeader.replace("Bearer ", "");

    jwt.verify(
        token,
        JWT_SECRET,
        { algorithms: ["HS256"] },
        (error, decodedToken) => {
            if (error) {
                res.status(401).send();
                return;
            }

            // decodedToken is the PayLoad that you
            // used earlier
            req.decodedToken = decodedToken;

            next();
        });
};

//------------------------------------------
// exports
//------------------------------------------
module.exports = check;