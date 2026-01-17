require('dotenv').config()
const express = require('express')

const app = express()
const port = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send("Hello World")
})
app.get('/twitter', (req, res) => {
  res.send('Nikhildotcom ')
})
app.get ('/login', (req,res) =>{
  res.send('<h1>Please Login at Nikhil Bhadwal</h1>')
})
app.get('/youtube',(req,res) =>{
  res.send(`<a href = "https://www.youtube.com/">Youtube</a>`)
})


app.listen(port,() =>{
  console.log(`Example app listening on port ${port}`)
})