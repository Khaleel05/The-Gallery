const session = require("express-session");
const MySQLStore = require('express-mysql-session')(session);
const db = require('./db');

const option = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'gallery',
    schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
};

const sessionStore = new MySQLStore(option);

module.exports =  sessionStore;