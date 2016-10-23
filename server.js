var app = require('express')();
var Twitter = require('node-twitter');
var bodyParser = require('body-parser');
var server = require('http').createServer(app);
var pixi = require('pixi')

/*On read le fichier de configuration*/
var cnf = '';
var fs = require('fs');
fs.readFile('config.txt', 'utf8', function(err, contents) {
		cnf = contents.split(",");
});

app.use(require('express').static('public'));
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
					socket.emit('score', socket.score); //On transmet le score initial au client
					socket.on('tweet_ex', function() // Si un tweet a été explosé on incrémente le score
	  			{
	      		socket.score++;
	      		socket.emit('score', socket.score);
					});
					/*On set l'API de stream twitter*/
					var twitterStreamClient = new Twitter.StreamClient('FkdOiZc663EQtsBJB6FhGtgE5',' xPbDmVaWjRoBXUC8LpdWf1YIshxfXo0B6rWxvgAal13hI1Km3s','790315200557768704-vjcJmRa0nbOfFcyhKA2L72HqcThywUo',' gPaTWDhbPg5xnwNRw1W1r53NmCj11b7kXb5xPbOc0yxOR');
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
						//socket.emit('tweet', tweet);
						console.log(tweet);
					});
					twitterStreamClient.start(cnf);
				});

server.listen(8080);
