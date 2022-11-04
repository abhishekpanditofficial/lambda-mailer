require('dotenv').config({});

module.exports = {
    mongoDB: {
        mongoDBUri: process.env.MONGO_HOST + "/" + process.env.MONGO_DB_NAME,
        mongoDBOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
    },
}