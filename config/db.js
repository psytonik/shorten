const mongoose = require('mongoose');

const connectDb = async () => {
    try{
        await mongoose.connect(process.env.DB_URI,{
            useNewUrlParser: true,
            useUnifiedTopology:true,
            useFindAndModify:false,
            useCreateIndex:true
        },console.log(`> Mongo DB connected`));
    }catch (e) {
        console.error(e.message);
        process.exit(1);
    }
}
module.exports = connectDb;
