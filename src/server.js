const express = require('express');
const server = express();

server.use(express.static('public'));

const nunjucks = require('nunjucks');
nunjucks.configure('src/views',{
    express: server,
    noCache: true
});

server.get('/', (req, res) =>{
    //sem nunjucks -> return res.sendFile(__dirname + '/views/index.html');
    return res.render('index.html');
});

server.get('/create-point', (req, res) =>{
    return res.render('create-point.html');
});

server.get('/search', (req, res) =>{
    return res.render('search-results.html');
});

server.listen(3000);