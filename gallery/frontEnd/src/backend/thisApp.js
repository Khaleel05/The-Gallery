//this for backend and express
const express = require('express');
const collection = require('./mysql')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.get('/',cors(),(req, res)=>{

})

// app.post('/', async(req, res)=>{
//     const {email, password}=req.body 

//     try{
//         //checking if the email already exist in the database.
//         const check = await collection.findOne({ email: email})
        
//         if(check){
//             res.json('exists')
//         }
//         else{
//             res.json('notexists')
//         }
//     }
//     catch(e){
//         res.json('notexists')
//     }
// })



// app.post('/signup', async(req, res)=>{
//     const {email, password}=req.body 

//     const data ={
//         email: email,
//         password: password
//     } 

//     try{
//         //checking if the email already exist in the database.
//         const check = await collection.findOne({ email: email})
        
//         if(check){
//             res.json('exists')
//         }
//         else{
//             res.json('notexists')
//             //if email does not exist, create a new user.
//             await collection.insertMany([data])
//         }
//     }
//     catch(e){
//         res.json('notexists')
//     }
// })

app.listen(3000, ()=> console.log('Server is running on port 3000'))