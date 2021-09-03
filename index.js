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
var ObjectID = require('mongodb').ObjectID;
const methodOverride = require('method-override')

// Custom routes
//const login = require('./routes/login');
const routes = require('./routes/routes');
const registration = require('./routes/registration');
const Article = require('./models/blog');

// Database
const connectDB = require('./config/db');

//connect to data base
connectDB();


app.use(methodOverride('_method'))

// set the view engine to ejs
app.set('view engine', 'ejs');

//static files
app.use(express.static(path.join(__dirname, 'public')))



app.get('/', async(req, res) => {
    const articles = await Article.find().sort({ createdAt: 'desc' })
    res.render('index', { articles: articles })
})


// app.get('/show', (req, res) => {
//     res.render('s
// })



//using custom routes
//app.use('/login', login);
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


//-----------------------------------------------


app.get("/userprofile", isLoggedIn, async(req, res) => {
    var user = req.user;
    const articles = await Article.find().sort({ createdAt: 'desc' })
    res.render("userprofile", { title: 'userprofile', user: user, articles: articles });
    // res.render("userprofile", { title: 'userprofile', user: user });
});


//Auth Routes


app.get("/login", (req, res) => {
    res.render("login");
});
app.post("/login", passport.authenticate("local", {
    successRedirect: "/userprofile",
    failureRedirect: "/login"
}), function(req, res) {});



//logout
app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});



// New Article
app.get('/new', (req, res) => {
    res.render("new", { title: 'userprofile', user: req.user })
})

app.post('/new', async(req, res) => {
    req.article = new Article()
    let article = req.article
    article.username = req.user.id
    article.title = req.body.title
    article.description = req.body.description
    article.markdown = req.body.markdown

    try {
        article = await article.save()
        var user = req.user;
        const articles = await Article.find().sort({ createdAt: 'desc' })
        res.render("userprofile", { title: 'userprofile', user: user, articles: articles });
    } catch (e) {
        console.log(e)
    }
})
app.post('/:id', async(req, res) => {
    const idString = req.params.id.toString();
    let article = await Article.findOne({ _id: idString })


    res.render('show', { article: article })

    if (article == null) res.redirect('/')

})
app.post('/user/:id', async(req, res) => {
    const idString = req.params.id.toString();
    let article = await Article.findOne({ _id: idString })


    res.render('usershow', { article: article })

    if (article == null) res.redirect('/')

})

// edit article


app.get('/edit/:id', async(req, res, next) => {
    const article = await Article.findById(req.params.id)
    res.render("edit", { article: article })
})

app.put('/edit/:id', async(req, res) => {

    let article = await Article.findById(req.params.id)
    article.title = req.body.title
    article.description = req.body.description
    article.markdown = req.body.markdown
    try {
        article = await article.save()

        res.render('usershow', { article: article })

    } catch (e) {
        // res.render(`articles/${path}`, { article: article })
        console.log(e)
    }
})

// res.render('usershow', { article: article })

app.delete('/:id', async(req, res) => {
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/userprofile')
})



//---------------------------------------



app.get('/userprofile', (req, res) => {
    res.render('userprofile', { user: req.params.username });

});

//MIDDLEWARE
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}


//-------------------------------




const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`server running on port ${port}`));