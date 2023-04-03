const PORT = 8001
const express = require('express')
const app = express()
const cors = require('cors')
const AWS = require('aws-sdk');
//const redis = require('redis');
app.use(cors())


const socketIo = require('socket.io')
const http = require('http')
const server = http.createServer(app)

const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:3000'
    }
}) //in case server and client run on different urls





const Redis = require('ioredis');

const redis = new Redis(6379, "127.0.0.1");

redis.psubscribe("messages", (err, count) => {
    //
});

redis.on("pmessage", (pattern, channel, message) => {

    console.log(message);
    // io.emit("news-action:" + message.event, message.data);
});









io.on('connection', (socket) => {

    socket.emit('message', 'hello from server')

    console.log('yes')

    socket.join('clock - room')

    socket.on('disconnect', (reason) => {
    })
})




const sqs = new AWS.SQS({
    region: 'us-east-1',
    accessKeyId: 'AKIARUXX3267DADIAWXC',
    secretAccessKey: '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'
});


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









server.listen(PORT, () => console.log(`server running on PORT ${PORT}`))
