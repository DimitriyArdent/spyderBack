const PORT = 8001
const express = require('express')
const app = express()
const cors = require('cors')
const AWS = require('aws-sdk');
const redis = require('redis');
const { firstBatchData } = require('./redisOperationsFunctions/retriveRedis')

app.use(cors())




//sqs (front -> scrapper)

app.get('/activateSearch', (req, res) => {


    const params = {
        MessageBody: JSON.stringify(req.query), // Replace with your message body
        QueueUrl: 'https://sqs.us-east-1.amazonaws.com/113262712766/backendAPItoScrapper' // Replace with your queue URL
    };

    sqs.sendMessage(params, (err, data) => {
        if (err) {
            console.log("Error", err);
            res.send("Error sending message");
        } else {
            console.log("Message sent", data.MessageId);
            res.send("Message sent");
        }
    });

})

//sqs (front -> queryer)

app.get('/get-data', (req, res) => {


    const params = {
        MessageBody: req.query.targetWord, // Replace with your message body
        QueueUrl: 'https://sqs.us-east-1.amazonaws.com/113262712766/backendAPItoQueryer' // Replace with your queue URL
    };

    sqs.sendMessage(params, (err, data) => {
        if (err) {
            console.log("Error", err);
            res.send("Error sending message");
        } else {
            console.log("Message sent", data.MessageId);
            res.send("Message sent");
        }
    });

})





app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))