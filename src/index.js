const express = require('express');
const morgan = require('morgan');
const path = require('path');
const { mongoose } = require('./database')
const app = express();


//Settings
//puerto que se está usando
app.set('port',process.env.PORT || 3000);

//Middlewares
app.use(morgan('dev'));
app.use(express.json());

//Routes
app.use('/',require('./routes/app.routes.js'));

// Static files
app.use(express.static(path.join(__dirname,'public')))


// Starting server
app.listen(app.get('port') , ()=>{
    console.log(`Server on port ${app.get('port')}`);
})