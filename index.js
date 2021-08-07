const express = require('express');
const routes = require('./routes/routes');

// Database
const connectDB = require('./config/db');

//connect to data base
connectDB();

const app = express();


// set the view engine to ejs
app.set('view engine', 'ejs');



app.get('/', (req, res) => {
    res.render('home')
})


app.use('/testroute', routes);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`server running on port ${port}`));