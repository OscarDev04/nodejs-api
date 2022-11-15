const express = require('express');
const app = express();
const dotenv = require('dotenv');
//Settung up config.env file variables
dotenv.config({path: './config/config.env'})

// Connect to Mongo Database
const connectDataBase = require('./config/database');
connectDataBase();

//SetUp Body Parser
app.use(express.json());


// Middlewares, must be before the routes

const middleware = (req, res, next) => { 
    console.log('middle');
    req.user = 'Poshed'; // setting up user variable globally
    next();
}

app.use(middleware);


// Importing all Routes
const jobs = require('./routes/jobs');
app.use('/api/v1/', jobs);



const PORT = process.env.PORT;
app.listen(PORT, ()=> {
    console.log(`Server on Port ${PORT} in ${process.env.NODE_ENV} mode.`);
});