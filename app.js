var express = require('express');
var http = require('http');
var httpProxy = require('http-proxy');

var multer = require('multer');
var upload = multer({
    dest: 'uploads/'
});

/*
 * Backend API
 */
var backend = express();
backend.get('/', function (req, res) {
    res.send('Hello World');
});

backend.post('/upload', upload.any(), function (req, res, next) {
    console.log(req.files);

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
        status: "ok",
        files: req.files
    }, null, 4));
});

var backendServer = backend.listen(8081, function () {
    var host = backendServer.address().address
    var port = backendServer.address().port

    console.log("Backend listening at http://%s:%s", host, port)
});

/*
 * Proxy to API server
 */
const targetUrl = 'http://localhost:8081';
const proxy = httpProxy.createProxyServer({
    target: targetUrl
});

/*
 * Frontend Application
 */
var app = express();
app.use('/api', (req, res) => {
    proxy.web(req, res, {
        target: 'http://localhost:8081'
    });
});

var server = new http.Server(app);
server.listen(8080, (err) => {
    if (err) {
        return console.log('ERROR:' + err);
    }

    var host = server.address().address
    var port = server.address().port

    console.log("Frontend listening at http://%s:%s", host, port)
});
