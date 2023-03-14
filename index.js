const express = require("express")
const app = express()
const cors = require("cors")

app.use(cors())
app.get('/', (req, res) => {
    res.send('si comprenzo')
})
app.get('/toss', (req, res) => {
    res.send('redheads are awesome')
})
app.get('/poss', (req, res) => {
    res.send('i love redheads')
})
app.listen(3000, () => {
    console.log('server running on port 3000')
})