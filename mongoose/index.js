const mongoose = require("mongoose");

const { DB_CONNECTION_URL } = process.env;

exports.connect = () => {
    // Connecting to the database
    mongoose
        .connect(DB_CONNECTION_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .catch((error) => {
            console.log("database connection failed. exiting now...");
            console.error(error);
            process.exit(1);
        });
};
