const express = require('express');
const server = express();
const db = require('./database/db');

server.use(express.static('public'));
server.use(express.urlencoded({ extended: true }));

const nunjucks = require('nunjucks');
nunjucks.configure('src/views', {
    express: server,
    noCache: true
});

server.get('/', (req, res) => {
    //sem nunjucks -> return res.sendFile(__dirname + '/views/index.html');
    return res.render('index.html');
});

server.get('/create-point', (req, res) => {
    return res.render('create-point.html');
});

server.get('/search', (req, res) => {

    const search = req.query.search;

    if(search == ''){
        return res.render('search-results.html', { total: 0});
    }

    db.all(`
        SELECT * FROM places WHERE city LIKE '%${search}%' OR state LIKE '%${search}%'
    `, function (err, rows) {
        if (err) console.log(err);

        const total = rows.length;

        return res.render('search-results.html', { places: rows, total});
    });

});

server.post('/create-point', (req, res) => {

    const query = `
        INSERT INTO places(
            image,
            name,
            address,
            address2,
            state,
            city,
            items
        ) VALUES (?,?,?,?,?,?,?);
`;

    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items
    ];

    function afterInsertData(err) {
        if (err) return res.send('Erro no cadastro');

        return res.render('create-point.html', {saved: true});
    }

    db.run(query, values, afterInsertData);
});

server.listen(3000);