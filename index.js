require('dotenv').config({});
const Email = require('./utils/email');
const mongoose = require('mongoose');
const { mongoDB } = require("./config");
const { OndcLeadService } = require('./services')

//MONGODB-CONFIGURE
mongoose.connect(mongoDB.mongoDBUri, mongoDB.mongoDBOptions, () => {
    console.log("Connected to MongoDB 📌...");
});


exports.handler = async (event) => {
    if(!event.body) return {  statusCode: 400, body: 'Sending failed'};
    let eventPayload;
    const eventBody = JSON.parse(event.body);

    try {
        var currentTime = new Date();
        var currentOffset = currentTime.getTimezoneOffset();
        var ISTOffset = 330;   // IST offset UTC +5:30 
        eventBody.createdAt = new Date(currentTime.getTime() + (ISTOffset + currentOffset)*60000);
        await new Email(eventBody).sendRegistrationDetails();
        eventPayload = {event: eventBody, status: true};
        await OndcLeadService.createLead(eventPayload);
        // mongoose.connection.close();
        return {
            statusCode: 200,
            body: 'Email sent!'
        }
    } catch (e) {
        eventPayload = {event: eventBody, status: false};
        await OndcLeadService.createLead(eventPayload);
        // mongoose.connection.close();
        console.error(e);
        return {
            statusCode: 400,
            body: 'Sending failed'
        }
    }
};

