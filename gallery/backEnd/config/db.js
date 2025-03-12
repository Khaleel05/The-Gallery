const mysql = require('mysql');
require('dotenv').config();

//create a pool instead of a single connection for better performance with sessions. 
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'gallery',
    connectionLimit:10
});

//Test the connection. 
db.getConnection((err, connection) => {
    if (err) throw err;
    console.log('MySQL Connected...');
    connection.release();
    //console.log(process.env.REACT_APP_TMDB_API_KEY)
});

db.query((req, res) =>{

})

module.exports = db;