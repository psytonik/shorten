const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const PORT = process.env.PORT || 5000;
const bodyParser = require('body-parser');
const compression = require('compression');
const path = require('path');
app.use(compression());
app.use(bodyParser.json());
app.use('/api/auth', require('./route/authRoute'));
app.use('/api/link', require('./route/linkRoute'));
app.use('/t', require('./route/redirectRoute'));

if(process.env.NODE_ENV === 'production'){
    app.use('/',express.static(path.join(__dirname,'client','build')));
    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}
const connectDb = async () => {
    try{
        await mongoose.connect(process.env.DB_URI,{
            useNewUrlParser: true,
            useUnifiedTopology:true,
            useCreateIndex:true
        },console.log(`> Mongo DB connected`));
        app.listen(PORT,()=>{
            console.log(`> Server run on ${PORT}`);
        });
    }catch (e) {
        console.error(e.message);
        process.exit(1);
    }
}
connectDb();

