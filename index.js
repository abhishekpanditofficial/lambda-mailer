require('dotenv').config({});
const Email = require('./utils/email');
const AWS = require('aws-sdk');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const BUCKET_NAME = process.env.BUCKET_NAME;
const IAM_USER_KEY = process.env.IAM_USER_KEY;
const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

const s3bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET
  });

function uploadObjectToS3Bucket(objectName, objectData, uuid) {
    const params = {
      Bucket: BUCKET_NAME,
      Key: objectName,
      Body: objectData
    };
    s3bucket.upload(params, function(err, data) {
      if (err) throw err;
      console.log(`File uploaded successfully at ${data.Location}`);
      fs.stat(objectName, function (err, stats) {
        // console.log(stats); 
     
        if (err) {
            return console.error(err);
        }
     
        fs.unlink(objectName,function(err){
             if(err) return console.log(err);
             console.log('Uploaded file deleted successfully from local');
        });  
     });
    });
}


const register = async (event) => {
    if(!event) return {  statusCode: 400, body: 'Sending failed'}
    try {
        event.createdAt = new Date();
        const data = JSON.stringify(event);
        await new Email(event).sendRegistrationDetails();
        let uuid = uuidv4();
        fs.writeFile(`./logs/${event.name}-${uuid}.json`, data, err => {
            if (err) {
              throw err
            }
            uploadObjectToS3Bucket(`./logs/${event.name}-${uuid}.json`, 'test', uuid);
          })
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



register({email: "abhishekpanditoff@gmail.com", name: "Abhishek Pandit"});