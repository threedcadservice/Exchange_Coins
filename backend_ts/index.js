/*
Project : LeaderInu
FileName : index.js
Author : LinkWell
File Created : 10/01/2022
CopyRights : LinkWell
Purpose : This is the main file which is first executed when running nodejs application through command line. It will load all relevant packages and depedencies for API request.
*/

const express = require('express')
const app = express()
const axios = require('axios');

var config = require("./helper/config")
var bodyParser = require('body-parser');

var user = require("./module/user/route/user")
var trending = require("./module/trending/route/apiRoute")

var mongoose = require('mongoose');
var cors = require('cors')

global.__basedir = __dirname;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/media'));
app.use(cors())

/*
* Below lines used to connect databse moongoose ORM
*/
mongoose.connect('mongodb://'+config.db.host+':'+config.db.port+'/'+config.db.name, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

var db = mongoose.connection;
// Added check for DB connection
db.on('connected', () => console.log('Connected'));
db.on('error', () => console.log('Connection failed'));

/*
* Below lines used to define route for the api services
*/
app.get('/', (req, res) => res.send('Welcome to LeaderInu API'))
app.use('/user', user)
app.use('/trending', trending);

/*
* Below lines used to handle invalid api calls
*/
app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!")
})
app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

/*
* create socket server
*/
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
      origin: '*',
    }
});

var interval = null;
var coin_addr = '';
var network = '';
var resolution = '';

const getChartData = async (address, network, resolution, from, to) => {
    const api = `https://api.dex.guru/v1/tradingview/history?symbol=${address}-${network}_USD&resolution=1&from=${from}&to=${to}&countback=320`;
    await axios.get(api)
    .then(result => {
        return result.data;
    })
    .catch((err) => {
        console.log(err)
    })
    return {t: [to], c: [291.8776783682552], o: [289.16335095885125], h: [292.07238945427986], l: [289.16335095885125]};
}

io.on('connection', async function(socket){
    console.log('a user connected');
    socket.on('gettingprice', async function(data) {
        coin_addr = data.coin
        network = data.network
        resolution = data.interval

        if(!!interval) {
            clearInterval(interval)
        } 

        interval = setInterval(async function() {    
            let from = ((new Date().getTime() - 60000)/1000).toFixed(0)
            let to = (new Date().getTime()/1000).toFixed(0)
            var res = await getChartData(coin_addr, network, resolution, from, to);

            if(!!res) {
                socket.emit('prices', {t: to, c: res['c'][res['c'].length-1], o: res['o'][res['o'].length-1], h: res['h'][res['h'].length-1], l: res['l'][res['l'].length-1]});
            }
        }, 10000, data)      
    });
    socket.on('end', async function() {
        if(!!interval) {
            clearInterval(interval)
            interval = null
        } 
    });
    socket.on("disconnect", (reason) => {
        if(!!interval) {
            clearInterval(interval)
            interval = null
        } 
    });
});

/*
* Below lines used to run api service 
*/
server.listen(config.app.port, () => console.log(`LeaderInu app listening on port ${config.app.port}!`))