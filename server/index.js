require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const {userRouter}= require("./routes/user")
const {courseRouter}= require("./routes/course")
const {adminRouter}= require("./routes/admin")

const app =express()
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173', 
  methods: ['GET', 'POST' ,'PUT', 'DELETE'],
}
));
console.log("Hello")
app.use("/api/v1/user",userRouter)
app.use("/api/v1/admin",adminRouter)
app.use("/api/v1/course",courseRouter)

async function main(){
    try{
    await mongoose.connect(process.env.MONGO_URL); // we import and conncet tthe db in the index js and nnot in  the db js because connecting the db in the db would ave made the db .js standalone likea a seaparte file with no link with the index.js , the the routes would not have been app to use the connection , whereas in index js the connection makes the db also able to give tout the models and routes access to the database
    console.log("Connected to the server");
    app.listen(3000);
}
catch(err){
    console.error("Error connecting to the server"+err)
}
}
main();