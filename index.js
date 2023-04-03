const PORT = 8001
const express = require('express')
const app = express()
const cors = require('cors')
const Redis = require('ioredis');
const redis = new Redis(6379, "127.0.0.1");
const redis2 = new Redis(6379, "127.0.0.1");

const publisher = new Redis();

const AWS = require('aws-sdk');
//const redis = require('redis');
app.use(cors())

///////////
//socket///
//////////
const socketIo = require('socket.io')
const http = require('http')
const server = http.createServer(app)
const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:3000'
    }
})











redis.psubscribe('__keyspace@0__:*', (err, count) => {
    if (err) {
        console.error(err);
    } else {
        console.log(`Subscribed to ${count} channels`);
    }
});

redis.on('pmessage', (pattern, channel, message) => {

    if (pattern === '__keyspace@0__:*') {
        const command = message.split(' ')[0];
        const key = channel.split(':')[1];
        if (command === 'set') {
            redis2.get(key, (err, value) => {
                if (err) {
                    console.error(err);
                } else {
                    io.to('clock-room').emit(`Key ${key} has been modified. New value is: ${value}`);
                }
            });
        }
    }
});
















io.on('connection', (socket) => {


    redis.on("pmessage", (pattern, channel, message) => {


        if (pattern === '__keyspace@0__:*') {
            const command = message.split(' ')[0];
            const key = channel.split(':')[1];
            if (command === 'set') {
                redis2.get(key, (err, value) => {
                    if (err) {
                        console.error(err);
                    } else {
                        socket.emit('message', `Key ${key} has been modified. New value is: ${value}`)

                    }
                });
            }
        }
    });
    socket.join('clock - room')
})






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


