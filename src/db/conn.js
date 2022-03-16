const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/registration")
.then(()=>{
    console.log("connection successful");
}).catch((err)=>{
    console.log("Not Connected");
})