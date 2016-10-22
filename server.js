var app = require('express')();
var twitter = require('node-twitter');
var bodyParser = require('body-parser');
var server = require('http').createServer(app);

/*On read le fichier de configuration*/
var cnf = '';
var fs = require('fs');
fs.readFile('config.txt', 'utf8', function(err, contents) {
    console.log(contents);
		cnf = contents.split(",");
});
console.log('after calling readFile');

/* Les routes du server */
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

/*etablissement des sockets et des données de communications*/
var io = require('socket.io').listen(server);
io.sockets.on('connection', function(socket)
	      {
					socket.score = 0; //On set le score à 0
					socket.emit('score', 0); //On transmet le score initial au client
					socket.on('tweet_ex', function(socket) // Si un tweet a été explosé on incrémente le score
	  			{
	      		socket.score++;
	      		socket.emit('score', socket.score);
					});
					/*On set l'API de stream twitter*/
					/*var twitterStreamClient = new Twitter.StreamClient('CONSUMER_KEY','CONSUMER_SECRET','TOKEN','TOKEN_SECRET');
					twitterStreamClient.on('close', function() {
    				console.log('Connection closed.');
					});
					twitterStreamClient.on('end', function() {
    				console.log('End of Line.');
					});
					twitterStreamClient.on('error', function(error) {
    				console.log('Error: ' + (error.code ? error.code + ' ' + error.message : error.message));
					});
					twitterStreamClient.on('tweet', function(tweet) {
						socket.emit('tweet', tweet);
						console.log(tweet);
					});
					twitterStreamClient.start(cnf);*/
				});

server.listen(8080);
