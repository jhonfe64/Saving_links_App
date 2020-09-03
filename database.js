const keys = require('./keys');

let user = keys.database.user;
let host = keys.database.host;
let password = keys.database.password;
let database = keys.database.database;
let port = keys.database.port

const Sequelize = require('sequelize');
const sequelize = new Sequelize(`mysql://${user}@${host}:${port}/${database}`);
if(sequelize){
    console.log("data based connected propertly");
}else{
    console.log("impossible to conenct to the database")
}

module.exports = sequelize

