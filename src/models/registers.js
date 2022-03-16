// const bcrypt = require('bcryptjs/dist/bcrypt');
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const res = require('express/lib/response');

const employeeSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    gender: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    confirmpassword: {
        type: String,
        required: true

    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})



// jwt middleware
// we wont use fatarrow function here

employeeSchema.methods.generateAuthToken = async function(){
    try{
        console.log(this._id);
        const token = jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token:token})
        await this.save();
        // console.log(token);
        return token;
    }
    catch(error){
        res.end("the error part" + error)
        console.log("the error part" + error)
    }
}



// converting password into hash
employeeSchema.pre("save", async function (next) {

    if (this.isModified("password")) {
        // const passwordHash = await bcrypt.hash(password, 10);
        // console.log(`the current password is ${this.password}`);
        this.password = await bcrypt.hash(this.password, 10)
        // console.log(`the current password is ${this.password}`);

        this.confirmpassword = await bcrypt.hash(this.password, 10);

    }
    next();
})

// the current password is amars
// the current password is $2a$10$vOkxD1FLW2FHiWKx.H5SduMUZv//YBtdOi6jKfy4PLazExuhFVBYK








// now we need to create a collections

const Register = new mongoose.model("Register", employeeSchema)

module.exports = Register;