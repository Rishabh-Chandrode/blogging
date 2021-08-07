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

//current User
router.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
})





router.get("/register", (req, res) => {
    res.render("registrationform");
});


router.post("/register", (req, res) => {

    User.register(new User({ username: req.body.username, phone: req.body.phone }), req.body.password, async function(err, user) {
        if (err) {
            console.log(err);
            res.render("registrationform");
        }
        passport.authenticate("local")(req, res, function() {
            user.save();
            console.log("Following User has been registerd");
            console.log(User)
            res.redirect("/");
        })
    })
})



// login





// router.get("/userprofile", isLoggedIn, (req, res) => {
//     res.render("userprofile");
// });


// //Auth Routes


// router.get("/login", (req, res) => {
//     res.render("login");
// });
// router.post("/login", passport.authenticate("local", {
//     successRedirect: "/registration/userprofile",
//     failureRedirect: "/registration/login"
// }), function(req, res) {});


// router.get('/userprofile', (req, res) => {
//     res.render('userprofile');
// });

// //logout
// app.get("/logout", (req, res) => {
//     req.logout();
//     res.redirect("/");
// });


// //MIDDLEWARE
// function isLoggedIn(req, res, next) {
//     if (req.isAuthenticated()) {
//         return next();
//     }
//     res.redirect("/login");
// }





module.exports = router;