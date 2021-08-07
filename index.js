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
app.use('/register', registration);
app.use('/testroute', routes);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`server running on port ${port}`));