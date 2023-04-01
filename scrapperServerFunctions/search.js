const axios = require('axios')
const cheerio = require('cheerio')
const { saveToRedis } = require('../redisOperationsFunctions/saveRedis')
const redis = require('redis');

const client = redis.createClient({
    socket: {
        host: 'localhost',
        port: 6379
    },
    connect_timeout: 5000
});

async function connectToRedis(client) {
    await client.connect()
}
connectToRedis(client)


async function initialSearch(URL, targetWord) {
    if (URL !== undefined) {
        try {
            const response = await axios(URL);
            const html = response.data;
            const $ = cheerio.load(html);
            const seenText = new Set();
            let counterT = 0

            $('body *:not(:empty)').each((i, element) => {

                const tagName = element.tagName;
                let text = $(element).text().trim().split(' ').slice(0, 7);
                text = text.join(' ')
                // console.log(tagName + "   " + i + '  ' + text)
                // try add   !text.includes('�')!
                if (!seenText.has(text) && text.toLowerCase().includes(targetWord.toLowerCase()) && !text.includes('class') && !text.includes('�')) {
                    seenText.add(text);
                }
            });


            return seenText;
        } catch (err) {
            console.log(err);
        }
    }

}


let linksRepository = []


async function pageLinks(URL, j, maxDepth, i, maxPagesNumber) {

    if (URL !== undefined) {
        const response = await axios(URL)
        const html = response.data;
        const $ = cheerio.load(html);
        const links = new Set()
        const httpRegex = /^(https?:\/\/)/i;
        try {
            $('a').each((i, element) => {


                let href = $(element).attr('href')
                if (href != undefined) href = href.trim();
                // href exists, not included already in the set, starts with http/s, not equal to URL, not equal to URL+/ and not been browsed already -> add
                if (href && !links.has(href) &&
                    httpRegex.test(href) &&
                    href !== URL &&
                    href !== URL.slice(0, URL.length - 1) &&
                    !href.includes('pdf') &&
                    !linksRepository.includes(href)) {
                    links.add(href)         // links of each page
                }
            })
        } catch (err) {
            console.log(err);
        }

        linksRepository = linksRepository.concat(Array.from(links))     // complete repository of all the  links

        return Array.from(links)// return links
    }



}



async function metaSearch(message) {
    let indxTotal = 0
    let indxIteration = 1
    let parentURL = ''

    if (message != '' && message != undefined) {
        message = JSON.parse(message)             // from JSON format to JS-Object
        maxDepth = parseInt(message.maxDepth)
        maxPagesNumber = parseInt(message.maxPagesNumber)
        let currentDepth = 0                                      // how many layers we had dived
        let CurrentPagesNumber = 0
        let links = []
        let targetWordOccurences = await initialSearch(message.URL, message.targetWord, CurrentPagesNumber) // searching the target word in this page
        let recursiveLinks = []
        let currentLayerLinks = []
        let currentLayerLinksPassed = []

        //###    first time search, results returned to front end application ####
        //########################################################################

        if (targetWordOccurences === undefined || targetWordOccurences.size == 0) console.log('no results, try another word')
        else {
            links = await pageLinks(message.URL)    // activating function pageLinks to get the links from this page
            links = Array.from(links)
            saveToRedis(targetWordOccurences, message.URL, currentDepth, client, links)  // REDIS!! FIRST TIME (url in depth 0 is father of himself)
        }

        //// https://www.learnpython.org/
        //###    recursive looping, results saved into reddis ####
        //########################################################################

        for (let j = 1; j <= maxDepth; j++) {
            console.log('the LAYER is ' + j)
            currentLayerLinksPassed = [...currentLayerLinks] // end of first layer 173 links passed from currentLayerLinks to currentLayerLinksPassed
            currentLayerLinks = []                           // currentLayerLinks empty again and ready to contain the links of second iteration
            let currentLinksList = currentDepth === 0 ? links : currentLayerLinksPassed // first iteration: links, after that : currentLayerLinksPassed

            // for (let i = 0; i < maxPagesNumber; i++)
            while (indxTotal < maxPagesNumber && (currentLinksList != undefined && currentLinksList.length > 0) && indxIteration <= currentLinksList.length) {

                console.log('the layer is' + j + '  the level is ' + indxIteration + ' the link is ' + currentLinksList[indxIteration])  //example : layer is 0, the level is 0 the link is https://www.learnx.org

                let targetWordOccurences2 = await initialSearch(currentLinksList[indxIteration], message.targetWord) // searching target word in specific web page

                if (targetWordOccurences2 != undefined && targetWordOccurences2.size != 0) { // targetWordOccurences2 != undefined, targetWordOccurences2 not empty
                    recursiveLinks = await pageLinks(currentLinksList[indxIteration])       //collect all the links in this specific web page in this specific  layer
                    saveToRedis(targetWordOccurences2, currentLinksList[indxIteration], j, client, recursiveLinks)  //  REDIS!!

                }
                if (targetWordOccurences2 != undefined && targetWordOccurences2.size === 0) recursiveLinks = [] // needed to prevent concatenation of same links over iterations if the targed word was not founs
                currentLayerLinks = currentLayerLinks.concat(recursiveLinks) // collect all the links from all the web pages of current layer, nullificated each layer

                indxIteration += 1
                indxTotal += 1
            }
            indxIteration = 0
            currentDepth = (currentDepth === 0) ? 1 : currentDepth
        }


    }

}





module.exports = { initialSearch, pageLinks, linksRepository, metaSearch };
