// Class: 1B05
// Admission Number: p2021391
// Name: Lim Chong Shan

console.log("-------------------------------");
console.log("ADES > backEnd > server.js");
console.log("-------------------------------");

//------------------------------------------
// imports
//------------------------------------------
const app = require('./controller/app');

//------------------------------------------
// configurations
//------------------------------------------
const hostname = 'localhost';
const port = 3000;

//------------------------------------------
// main
//------------------------------------------
// start the server and start listening for incoming requests
app.listen(port, hostname, () => {
    console.log(`Server started and accessible via http://${hostname}:${3001}/`);
});
