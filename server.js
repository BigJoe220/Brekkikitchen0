const express = require('express')
require('./config/database')
const port = process.env.port || 2019
const app = express();
app.use(express.json())

const userRout = require('./Router/userRouter')
const restaurantRouter = require('./Router/restaurantRouter');
const foodRouter = require('./Router/foodRouter')

app.use(userRout)
app.use(restaurantRouter);
app.use(foodRouter)


app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
    
})  