const mongoose = require('mongoose')
require('dotenv').config()

const URL = process.env.MONGODB_URI
mongoose.connect(URL)
.then(()=>{
    console.log('Connection to Database successfully')
})
.catch((error)=>{
    console.log('Connection to Database failed', error.message)
})