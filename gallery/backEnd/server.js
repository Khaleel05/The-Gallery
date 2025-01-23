const express = require('express');
const mysql =  require('mysql');
const cors = require('cors');
const path = require('path') //take this out later. 

const app = express();

app.use(express.json());

app.use(cors());
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'gallery'
})

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/user', (req, res) => {
    const sql = "SELECT * FROM user";
    db.query(sql, (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    })
});

//cheking login details match with database details. 
app.post('/user', (req, res) => {
    const sql = "SELECT * FROM user WHERE Email = ? AND Password = ?";
    const values  = [
        req.body.email,
        req.body.password
    ]
    
    db.query(sql, values, (err, data) => {
        if(err) return res.json("serverside app.post " + err);
        if (data.length>0){
            return res.json("exists");
        }else{
            return res.json("notexists");
        }
    });
});

app.listen(8081, () => console.log('Server is running on port 8081'));

db.connect((err) => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

