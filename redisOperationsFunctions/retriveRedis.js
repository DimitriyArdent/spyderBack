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
const sqs = new AWS.SQS({
    region: 'us-east-1',
    accessKeyId: 'AKIARUXX3267DADIAWXC',
    secretAccessKey: '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'
});



let depth0Flag = true










// this function initiated recursively, not by SQS!
// the function will run recursively till she find all depth==0
// she will send all the depth == 0 via SQS (frontFromQueryer) after that she will STOP

function firstBatchData() {
    let c = 1
    depthZeroRepository = []
    const intervalId = setInterval(async () => {

        // if (depth0Flag) {
        let firstBatch = []
        console.log('.')// 1 is the new 0
        console.log('..')
        let keys = await client.keys('*')   // list of all the keys ( array of urls's)

        for (let i = 0; i < keys.length; i++) { // iterating over each url, and extracting the phrases and the depth of this url

            let depth = await client.HGET(keys[i], 'Depth')

            if (parseInt(depth) === 1 && !depthZeroRepository.includes(keys[i])) {
                let phrases = await client.HGET(keys[i], 'phrases')
                firstBatch.push({
                    depth: depth,
                    phrases: phrases,
                    key: keys[i]
                })
                depthZeroRepository.push(keys[i])
            }
        }
        if (firstBatch.length > 0) {   // only if firstBatch of data was aquired
            const params = {
                MessageBody: JSON.stringify(firstBatch),
                QueueUrl: 'https://sqs.us-east-1.amazonaws.com/113262712766/frontFromQueryer'
            };


            sqs.sendMessage(params, (err, data) => {
                if (err) {
                    console.log("Error", err);
                } else {
                    console.log("Message sent", data.MessageId);
                }
            })
            // depth0Flag = false                      // prevent further execution of this function
            // clearInterval(intervalId)
            //  }


        }

    }, 1000)
}



async function advancedRedisSearch(URLandDepth) {
    let params = JSON.parse(URLandDepth)
    let advancedSearchResults = []
    let doughterURLs

    let keys = await client.keys('*')   // list of all the keys ( array of urls's)

    for (let i = 0; i < keys.length; i++) { // iterating over each url, and extracting the phrases and the depth of this url


        if (keys[i] === params.targetLink) {                            // if key URL in redis == clickedURL
            doughterURLs = JSON.parse(await client.HGET(keys[i], 'linksInThisUrl'))  // all the doughter links of the clickedURL

        }

    }
    for (let i = 0; i < doughterURLs.length; i++) {                     // iterating over  all   doughter urls of the clickedURL
        for (let l = 0; l < keys.length; l++) {                         // iterating all over urls in the DB

            if (doughterURLs[i] === keys[l]) {                          // if doughter url == url in db, hence url in db has the target word
                let values = await client.HGETALL(keys[l])              // get all information of this url (his depth, his phrases, and his own url's )
                let valuesAndFatherUrl = { values: values, fatherUrl: params.targetLink } // previous line + the url that was hited on the front
                // we need to know that to locate the values in right place in the front
                advancedSearchResults.push(valuesAndFatherUrl)
            }

        }
    }


    if (advancedSearchResults.length > 0) {
        const params = {
            MessageBody: JSON.stringify(advancedSearchResults),
            QueueUrl: 'https://sqs.us-east-1.amazonaws.com/113262712766/Advanced_Frontfromqueryer'
        };


        sqs.sendMessage(params, (err, data) => {
            if (err) {
                console.log("Error", err);
            } else {
                console.log("Message sent", data.MessageId);
            }
        })
    }





}




module.exports = { firstBatchData, advancedRedisSearch }