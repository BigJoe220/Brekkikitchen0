const express = require('express')
require('./config/database')
const port = process.env.port || 2019
const app = express();
app.use(express.json())

const userRout = require('./Router/userRouter')

app.use(userRout)


app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
    
})