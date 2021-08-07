const express = require('express');

// Database
const connectDB = require('./config/db');

const app = express();

//connect to data base

connectDB();

app.get('/', (req, res) => {
    res.send('hello world!');
})

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`server running on port ${port}`));