const mysql = require('mysql');
require('dotenv').config();

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'gallery'
});

db.connect((err) => {
    if (err) throw err;
    console.log('MySQL Connected...');
    //console.log(process.env.REACT_APP_TMDB_API_KEY)
});

db.query((req, res) =>{

})

module.exports = db;