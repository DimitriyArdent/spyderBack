


function saveToRedis(targetWordOccurences, URL, currentDepth, client) {
    console.log(targetWordOccurences + '  ' + URL + '  ' + currentDepth)
    targetWordOccurences = Array.from(targetWordOccurences)

    client.HSET(URL, ["phrases", JSON.stringify(targetWordOccurences), "Depth", currentDepth], (err, reply) => {
        if (err) {
            console.error(err);
        } else {
            console.log(reply);
        }
    });



    /*
        let depth = await client.HGET(URL, 'Depth')
        let phrases = await client.HGET(URL, 'phrases')
        console.log(depth)
    */



}

module.exports = { saveToRedis }