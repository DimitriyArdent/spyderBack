PORT = 8003
const express = require('express')
const app = express()
const cors = require('cors')
const redis = require('redis');
const { firstBatchData } = require('./redisOperationsFunctions/retriveRedis')
const { advancedRedisSearch } = require('./redisOperationsFunctions/retriveRedis')


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




// !!IMPORTANT!!  firstBatchData() activated by himsaelf, and not via SQS
firstBatchData() // activated till aquire and send all dats from first search iteration ( url.depth == 0 ).








//reciving message from the front / advanced search / url depth >0 
/*
setInterval(async () => {



    const params = {
        QueueUrl: 'https://sqs.us-east-1.amazonaws.com/113262712766/backendAPItoQueryer',
        MaxNumberOfMessages: 1, // maximum number of messages to receive at a time
        WaitTimeSeconds: 1 // maximum time to wait for new messages
    };

    let response = await sqs.receiveMessage(params).promise();


    if (response.Messages?.[0]?.Body?.length > 0) {
        advancedRedisSearch(response.Messages[0].Body) // URL that was hited at the front, chosen from the first batch of url's


        //deleting message from the front
        var deleteParams = {
            QueueUrl: 'https://sqs.us-east-1.amazonaws.com/113262712766/backendAPItoQueryer',
            ReceiptHandle: response.Messages[0].ReceiptHandle
        };
        //   var removedMessage = await sqs.deleteMessage(deleteParams).promise();



    }


}, 2000);

*/













app.listen(PORT, () => {
    console.log('queryer is here')
})