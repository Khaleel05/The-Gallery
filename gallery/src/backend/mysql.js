//connect to MySQL database
const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1Hamster',
  database: 'users'
})
.then(()=>{
    console.log("MySQL connected");
})
.catch(()=>{
    console.log('failed');
})

//schema for the users of the app
