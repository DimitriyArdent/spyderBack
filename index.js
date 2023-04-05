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






io.on('connection', (socket) => {

    redis.on("pmessage", (pattern, channel, message) => {


        if (pattern === '__keyspace@0__:*') {


            const command = message.split(' ')[0];
            const keyStart = channel.split(':')[1];
            const keyEnd = channel.split(':')[2];
            const finalKey = keyStart + ':' + keyEnd




            if (command === 'hset') {
                redis2.hgetall(finalKey, (err, value) => {
                    if (err) {
                        console.error(err);
                    } else {
                        socket.emit('message', JSON.stringify({ selfKey: finalKey, value: value }))

                    }
                });
            }
        }
    });
    socket.join('clock - room')
})





const sqs = new AWS.SQS({
    region: 'us-east-1',
    accessKeyId: 'AKIARUXX3267DADIAWXC',
    secretAccessKey: 'zc8bytuPobqnGDbk/0h4Z+PVtsLLIu18H3jMj3Mz'
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


