const mongoose = require('mongoose');


const connectDataBase = () => { 
    mongoose.connect(process.env.DB_LOCAL_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
     }).then( conn => {
        console.log(`MongoDB Database connected with host: ${conn.connection.host}`);
    });
 }

module.exports = connectDataBase;