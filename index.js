require('dotenv').config({});
const Email = require('./utils/email');


exports.handler = async (event) => {
    const eventBody = JSON.parse(event.body);


    try {
        await new Email(eventBody).sendRegistrationDetails();
        console.log("Sent");
        return {
            statusCode: 200,
            body: 'Email sent!'
        }
    } catch (e) {
        console.error(e);
        return {
            statusCode: 400,
            body: 'Sending failed'
        }
    }
};



