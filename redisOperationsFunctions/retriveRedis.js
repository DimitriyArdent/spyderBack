const redis = require('redis');
const AWS = require('aws-sdk');
const axios = require('axios');

//redis client
const client = redis.createClient({
    socket: {
        host: 'localhost',
        port: 6379
    }
});


//connect to redis
async function connectToRedis(client) {
    await client.connect()
}
connectToRedis(client)

// connect to SQS




let depth0Flag = true


async function firstBatchData() {

    if (depth0Flag) {
        firstBatch = []

        let keys = await client.keys('*')   // list of all the keys ( array of urls's)

        for (let i = 0; i < keys.length; i++) { // iterating over each url, and extracting the phrases and the depth of this url

            let depth = await client.HGET(keys[i], 'Depth')

            if (parseInt(depth) === 0) {
                let phrases = await client.HGET(keys[i], 'phrases')
                firstBatch.push({
                    depth: depth,
                    phrases: phrases,
                    key: keys[i]
                })
            }
        }
        if (firstBatch && firstBatch !== []) {   // only if firstBatch of data was aquired

            const params = {
                MessageBody: JSON.stringify(firstBatch), // Replace with your message body
                QueueUrl: 'https://sqs.us-east-1.amazonaws.com/113262712766/frontFromQueryer' // Replace with your queue URL
            };
            sqs.sendMessage(params, (err, data) => {
                if (err) {
                    console.log("Error", err);
                } else {
                    console.log("Message sent", data.MessageId);
                }
            })
            depth0Flag = false                      // prevent further execution of this function
        }


    }


}

module.exports = { firstBatchData }