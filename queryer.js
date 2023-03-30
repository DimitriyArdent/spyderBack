PORT = 8003
const express = require('express')
const app = express()
const cors = require('cors')
const redis = require('redis');
const { firstBatchData } = require('./redisOperationsFunctions/retriveRedis')

app.use(cors())

//redis client
const client = redis.createClient({
    socket: {
        host: 'localhost',
        port: 6379
    }
});


//connect to redis
async function
    connectToRedis(client) {
    await client.connect()
}
connectToRedis(client)



// connect to AWS
const AWS = require('aws-sdk');








setInterval(async () => {



    firstBatchData() // activated till aquire and send all dats from first search iteration ( url.depth == 0 )










    //reciving message from the front

    const params = {
        QueueUrl: 'https://sqs.us-east-1.amazonaws.com/113262712766/backendAPItoQueryer',
        MaxNumberOfMessages: 1, // maximum number of messages to receive at a time
        WaitTimeSeconds: 20 // maximum time to wait for new messages
    };

    let response = await sqs.receiveMessage(params).promise();



    if (response && response.Messages && response.Messages[0].Body) {
        console.log('a')



        //deleting message from the front

        var deleteParams = {
            QueueUrl: 'https://sqs.us-east-1.amazonaws.com/113262712766/backendAPItoQueryer',
            ReceiptHandle: response.Messages[0].ReceiptHandle
        };
        var removedMessage = await sqs.deleteMessage(deleteParams).promise();



    }


}, 3000);















app.listen(PORT, () => {
    console.log('queryer is here')
})