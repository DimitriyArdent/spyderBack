const PORT = 8000
const express = require('express')
const app = express()
const cors = require('cors')

const { pollMessages } = require('./scrapperServerFunctions/poll')
const { metaSearch } = require('./scrapperServerFunctions/search')

const AWS = require('aws-sdk');
app.use(cors())

 



const intervalId = setInterval(async () => {
    let response = await pollMessages(sqs); // activating FUNCTION pollMessages(sqs) to poll messages from SQS
    /// if there is a message///
    if (response.Messages && response.Messages.length > 0 && response.Messages[0].Body) {

        ////////ACCEPT/////////
        //////////////////////
        message = response.Messages[0].Body || ''; // example : {"targetWord":"aqua","URL":"https://en.wikipedia.org/wiki/Main_Page","maxDepth":"1","maxPagesNumber":"1"}
        messageToDelete = response.Messages[0].ReceiptHandle || '' // identifier of  the to be deleted message


        ////////PROCESS/////////
        //////////////////////
        metaSearch(message)


        ////////DELETE/////////
        //////////////////////
        var deleteParams = {
            QueueUrl: 'https://sqs.us-east-1.amazonaws.com/113262712766/backendAPItoScrapper',
            ReceiptHandle: response.Messages[0].ReceiptHandle
        };
        var removedMessage = await sqs.deleteMessage(deleteParams).promise();
        //clearInterval(intervalId)
    }



}, 1000);



app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))
