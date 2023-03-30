const { initialSearch } = require('./search');
const { pageLinks } = require('./search')
const axios = require('axios');


async function pollMessages(sqs) {
    let message = ''
    let messageToDelete = ''

    const params = {
        QueueUrl: 'https://sqs.us-east-1.amazonaws.com/113262712766/backendAPItoScrapper',
        MaxNumberOfMessages: 1, // maximum number of messages to receive at a time
        WaitTimeSeconds: 20 // maximum time to wait for new messages
    };

    let response = await sqs.receiveMessage(params).promise();


    return response

}

module.exports = { pollMessages }