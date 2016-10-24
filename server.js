var app = require('express')();
var Twitter = require('node-twitter');
var bodyParser = require('body-parser');
var server = require('http').createServer(app);
var pixi = require('pixi')

/*On read le fichier de configuration*/
var cnf = '';
var fs = require('fs');
fs.readFile('config.txt', 'utf8', function(err, contents) {
		cnf = contents.replace('\n','');
		console.log(cnf);
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

//Etablissement de L'API twitter
var twitterSearchClient = new Twitter.SearchClient('FkdOiZc663EQtsBJB6FhGtgE5','xPbDmVaWjRoBXUC8LpdWf1YIshxfXo0B6rWxvgAal13hI1Km3s','790315200557768704-n46IDXQuwkwV5y8TUzHiPdGfF3vjT7o','MRQISKaO9X8VHq2md9RKRJ8H86ZjlE6Et7BFA9ExWf7BD');
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
					twitterSearchClient.search({'q': cnf}, function(error, result) {
    				if (error)
    				{
        				console.log('Error: ' + (error.code ? error.code + ' ' + error.message : error.message));
    				}
    				if (result)
    				{
							socket.emit('tweet', result);
        			console.log('tweet');
    				}
					});
					//Quand un tweet est get on l'emet
					/*twitterStreamClient.on('tweet', function(tweet) {
										//socket.emit('tweet', tweet);
										//console.log(tweet);
										console.log('tweet.');
					});
					twitterStreamClient.start(cnf);*/
					console.log("connection");
				});
server.listen(8080);
