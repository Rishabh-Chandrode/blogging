const express = require('express');
const router = express.Router();

//importing UserSchema
const User = require("./../models/user");

//importing other library
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const session = require("express-session");


//registration method


router.use(bodyParser.urlencoded({ extended: true }))
router.use(passport.initialize());
router.use(passport.session());




router.get("/register", (req, res) => {
    res.render("registrationform");
});


router.post("/register", (req, res) => {

    User.register(new User({ username: req.body.username, phone: req.body.phone }), req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            res.render("registrationform");
        }
        passport.authenticate("local")(req, res, function() {
            console.log("Following User has been registerd");
            console.log(User)
            res.redirect("/");
        })
    })
})




module.exports = router;