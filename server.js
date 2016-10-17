var app = require('express')();
var session = require('cookie-session');
var bodyParser = require('body-parser');
var Twitter = require('twitter-node-client').Twitter;
var server = require('http').createServer(app);

app.use(session({secret: 'BurnBabyBurn'}))
    .use(function(req, res, next)
	 {
	     if (typeof(req.session.score) == undefined)
		 req.session.score = 0
	     next();
	 })
    .get('/', function(req, res)
	 {
	     res.render('client_menu.ejs');
	 })
    .get('/trial', function(req, res)
	 {
	     res.render('client_trial.ejs');
	 })
    .get('/hallOfFame', function(req, res)
	 {
	     res.render('client_hof.ejs');
	 })

server.listen(8080);
