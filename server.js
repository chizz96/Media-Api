const express = require('express')

require("./databse/database")

require('dotenv').config()

const userRouter = require('./routes/userRouter')

const app = express()

const port = process.env.PORT

app.use(express.json())

app.use(userRouter)

app.listen(port,()=>{
    console.log(`Server is running on port:${port}`)
})