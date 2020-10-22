const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')
const userRouter =require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()

//TODO: --process.env.PORT to deploy on heroku
const port = process.env.PORT



//TODO: --express.json() is a method inbuilt in express 
//TODO: --to recognize the incoming Request Object as a JSON Object 
app.use(express.json())
// calling User and Task file and running as a mini app
app.use(userRouter)
app.use(taskRouter)


app.listen(port, () => {
    console.log('Server is Up on Port ' + port)
})


