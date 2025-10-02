const mongoose = require ("mongoose");
require('dotenv').config()

const DB = process.env.MONGODB_URI

mongoose.connect(DB)
.then(()=>{
    console.log(`Database successfully connected`)

})
.catch((err)=>{
    console.log(`Error connecting to database`,err.message);
    
})