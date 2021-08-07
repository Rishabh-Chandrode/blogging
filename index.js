const express = require('express');
const path = require('path');

const app = express();

//registration library
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const session = require("express-session");
const User = require("./models/user");

// Custom routes
const routes = require('./routes/routes');
const registration = require('./routes/registration');

// Database
const connectDB = require('./config/db');

//connect to data base
connectDB();



// set the view engine to ejs
app.set('view engine', 'ejs');

//static files
app.use(express.static(path.join(__dirname, 'public')))



app.get('/', (req, res) => {
    res.render('home')
})


//using custom routes
app.use('/registration', registration);
app.use('/testroute', routes);


//registration methods


app.use(session({
    secret: "Any normal Word", //decode or encode session
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 2 * 60 * 1000
    }
}));


passport.serializeUser(User.serializeUser()); //session encoding
passport.deserializeUser(User.deserializeUser()); //session decoding
passport.use(new LocalStrategy(User.authenticate()));


app.use(bodyParser.urlencoded({ extended: true }))
app.use(passport.initialize());
app.use(passport.session());





const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`server running on port ${port}`));