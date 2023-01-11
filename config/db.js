const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDB = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
        });

        console.log('MongoDB Connected...');
    } catch (err) {
        console.log('ERROR');
        console.error();

        // 'process' object produced by Node & '1' for login errors
        // Hence we exist 'process' with failure
        process.exit(1);
    }
};

module.exports = connectDB;
