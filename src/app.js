require('dotenv').config();
const express = require("express")
const app = express();
const port = process.env.PORT || 3000;
require("./db/conn");
const path = require('path');
const hbs = require('hbs');
const Register = require("./models/registers");
const bcrypt = require("bcryptjs");


// console.log(__dirname,"../public");
const static_path = path.join(__dirname, "../public")

const template_path = path.join(__dirname, "../templates/views")

const partials_path = path.join(__dirname, "../templates/partials")




app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.use(express.static(static_path));

app.set("view engine", "hbs");

app.set("views", template_path);

hbs.registerPartials(partials_path);



// env 
console.log(process.env.SECRET_KEY);
// asasasasasasasasasasasasasasasasas



app.get("/", (req, res) => {
    res.render("index");
});

app.get("/register", (req, res) => {
    res.render("register")
})

app.get("/login", (req, res) => {
    res.render("login")
})


// validation for register
// create a new user in our database
app.post("/register", async (req, res) => {
    try {
        // console.log(req.body.firstname);
        // res.send(req.body.firstname)

        const password = req.body.password;
        const cpassword = req.body.confirmpassword;

        if (password === cpassword) {
            const registerEmployee = new Register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                gender: req.body.gender,
                phone: req.body.phone,
                age: req.body.age,
                password: password,
                confirmpassword: cpassword
            })


            console.log("the success part" + registerEmployee);



            const token = await registerEmployee.generateAuthToken();
            console.log("the token part" + token);







            //******* after the next *******// 







            const registered = await registerEmployee.save();

            console.log("the page part"+registered);

            res.status(201).render("index");

        } else {
            res.send("Passwords are not Matching")
        }
    } catch (error) {
        res.status(404).send(error)
    }
})






// validation for login
app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        // console.log(`${email} is emaiil and password is ${password}`);

        const useremail = await Register.findOne({ email: email }) //object destruction below // Register.findOne({email});





        const isMatch = await bcrypt.compare(password, useremail.password);



        const token = await useremail.generateAuthToken();
            console.log("the token part" + token);



        if (isMatch) {
            res.status(201).render('index');
        }
        else {
            res.send('invalid login details')
        }

    } catch (error) {
        res.status(400).send('invalid login details')
    }
})




// const bcrypt = require('bcryptjs');




// const securePassword = async(password)=>{

//     const passwordHash = await bcrypt.hash(password, 10);
//     console.log(passwordHash);
//     // $2a$10$QRjsDgtDDRRhqRgupeTvg.NejKX3vKjnYUQIUlx4DBbIa9gficuEG

//     const passwordMatch = await bcrypt.compare(password, passwordHash);
//     console.log(passwordMatch);
//     // true
// }
// securePassword("kshitij@123");






// // ************ JWT ********************

// const jwt = require("jsonwebtoken");
// const async = require("hbs/lib/async");

// const createToken = async ()=>{
//     // jwt.sign({_id},)
//     // jwt.sign({_id:"622c7e2e996732e696f8ff64"},"secretKey",)
//    const token = await jwt.sign({_id:"622c7e2e996732e696f8ff64"},"djkbfkfgjejweerjejwerererjdjdjds",
//    {expiresIn:"5 secs"})

// //    { _id: '622c7e2e996732e696f8ff64', iat: 1647436571, exp: 1647436576 }

//     console.log(token);

//     // generated token
//     // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjJjN2UyZTk5NjczMmU2OTZmOGZmNjQiLCJpYXQiOjE2NDc0MzYxMDB9.AI3ljAUMqatWn_b2ZggADlgddDkWAp51fbVd6J8Y6CI



//     const userVar = await jwt.verify(token,"djkbfkfgjejweerjejwerererjdjdjds")
//     console.log(userVar);

//     // { _id: '622c7e2e996732e696f8ff64', iat: 1647436100 }
// }

// createToken();









app.listen(port, () => {
    console.log(`server connected at ${port}`);
})