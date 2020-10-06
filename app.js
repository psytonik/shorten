const express = require('express');

const bodyParser = require('body-parser');
const compression = require('compression');
const path = require('path');
const cors = require('cors');
const connectDb = require('./config/db');
require('dotenv').config();

const PORT = process.env.PORT || 5000;
const app = express();
connectDb();

app.use(compression());
app.use(bodyParser.json());

//// CORS ////
if (process.env.NODE_ENV === 'development') {
    app.use(cors({origin: `${process.env.CLIENT_URL}`}));
}

app.use('/api/auth', require('./route/authRoute'));
app.use('/api/link', require('./route/linkRoute'));
app.use('/t', require('./route/redirectRoute'));

if(process.env.NODE_ENV === 'production'){
    app.use('/',express.static(path.join(__dirname,'client','build')));
    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}
app.listen(PORT,()=>{
    console.log(`> Server run on ${PORT}`);
});

