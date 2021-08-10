// Class: 1B05
// Admission Number: p2021391
// Name: Lim Chong Shan

console.log("-------------------------------");
console.log("ADES > frontEnd > index.js");
console.log("-------------------------------");

//------------------------------------------
// imports
//------------------------------------------
const express = require("express");
const app = express();

//------------------------------------------
// endpoints
//------------------------------------------
app.get("/", (req, res) => {
    res.sendFile("/public/index.html", { root: __dirname });
});

app.get("/login/", (req, res) => {
    res.sendFile("/public/login.html", { root: __dirname });
});

app.get("/add-game/", (req, res) => {
    res.sendFile("/public/add_game.html", { root: __dirname });
});

app.get("/add-cat/", (req, res) => {
    res.sendFile("/public/add_cat.html", { root: __dirname });
});

//------------------------------------------
// configurations
//------------------------------------------
const PORT = 3001;

//------------------------------------------
// main
//------------------------------------------
app.listen(PORT, () => {
    console.log(`Client server has started listening on port ${PORT}`);
});