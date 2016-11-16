'use strict';

var express = require('express');
var path = require('path');
var config = require('./config');
var favicon = require('serve-favicon');
var engine = require('consolidate');

var app = express();
var baseDir = __dirname;

app.engine('html', engine.mustache);
app.set('view engine', 'html');
app.set('views', path.join(baseDir, '/views'));

app.use(express.static(path.join(baseDir, '../public')));
app.use(favicon(path.join(baseDir, '../public/favicon.ico')));
app.use('/', require(path.join(baseDir, 'index')));


app.listen(config.port, function () {
    console.log('Example app listening on port ' + config.port);
});
