var app = require('express')();
var bodyParser = require('body-parser');
var Twitter = require('twitter-node-client').Twitter;
var server = require('http').createServer(app);

app.get('/', function(req, res)
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

var io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket)
	      {
                  socket.score = 0;
		  socket.emit('score', 0);
	      })
    .sockets.on('twitt_ex', function(socket)
		{
		    socket.score++;
		    socket.emit('score', socket.score);
		});

server.listen(8080);
