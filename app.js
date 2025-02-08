if(process.env.NODE_ENV != "production") {
    require('dotenv').config();
}


const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoConnect = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const usersRouter = require("./routes/user.js");



const port = 9999;
// const MONGO_URL = 'mongodb://127.0.0.1:27017/Delta-Project';

const dbUrl = process.env.ATLASDB_URL;

main()
    .then(() => {
        console.log("MongoDB connected..");
    })
    .catch((err) => {
        console.log("Error : ",err);
    })

async function main() {
    await mongoose.connect(dbUrl);
}


app.set("view-engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


const store = MongoConnect.create({
    mongoUrl : dbUrl,
    crypto : {
        secret : process.env.SECRET,
    },
    touchAfter : 24 * 3600
});

store.on("error", () => {
    console.log("ERROR IN MONGO SESSION STORE", err);
})


const sessionOption = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized  : true,
    cookie : {
        expire : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true,

    }
}

app.use(session(sessionOption));
app.use(flash());

//Passport authentication 5 lines/ 5 thing required.....
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));       // Here User is model from user.js 

passport.serializeUser(User.serializeUser());               // Here User is model from user.js                
passport.deserializeUser(User.deserializeUser());           // Here User is model from user.js 


// connect flash middleware
app.use((req, res, next) => {
    res.locals.successMsg = req.flash("success");
    res.locals.deleteMsg = req.flash("delete");
    res.locals.errorMsg = req.flash("error");
    res.locals.currUser = req.user;
    next();
})


app.use("/listings", listingRouter);
app.use("/listings/:id/review", reviewRouter);
app.use("/", usersRouter);


// app.get("/demoUser", async (req,res) => {
//     let fakeUser = new User({
//         email : "fake@gmail.com",
//         username : "mysterious"
//     });

//     let registerUser = await User.register(fakeUser, "Hello World");
//     res.send(registerUser);
// })


app.get("/", (req,res) => {
    res.send("Home");
})



app.all("*", (req, res, next) => {
    next(new ExpressError(400, "Page Not Found !"));
})


//Custom Error handling middleware
app.use((err, req, res, next) => {
    let{statusCode = 500, message = "Something went wrong !!"} = err;
    // res.status(statusCode).send(message);
    res.render("error.ejs", {message});
})


app.listen(port, () => {
    console.log(`Server is listening on port : ${port}`);
})