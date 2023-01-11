const express=require('express')
const app=express()
const path = require("path");
require('dotenv').config()
const cors=require('cors')

app.use(express.json())
app.use(cors({
  origin:'*'
}))
app.use('/',express.static(__dirname))

const port=process.env.PORT||5000

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname+'/index.html'));
});
app.get('/oauth2callback/', function(req, res) {
  console.log('rediredted!!!!!');
  res.redirect('/home.html')
})

app.listen(port,() => {
    console.log(`node server listening at port no ${port}`)
})
