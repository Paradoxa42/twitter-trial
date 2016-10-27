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
		console.log("config : " + cnf);
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

function insert(str, index, value)
{
	   return str.substr(0, index) + value + str.substr(index);
}
function formatTxt(str)
{
		limit = i = 60;
		while (i < str.length)
		{
			str = insert(str, i, "\n");
			i += limit;
		}
		return str;
}

//Etablissement de L'API twitter
//var twitterStreamClient = new Twitter.StreamClient('FkdOiZc663EQtsBJB6FhGtgE5','xPbDmVaWjRoBXUC8LpdWf1YIshxfXo0B6rWxvgAal13hI1Km3s','790315200557768704-n46IDXQuwkwV5y8TUzHiPdGfF3vjT7o','MRQISKaO9X8VHq2md9RKRJ8H86ZjlE6Et7BFA9ExWf7BD');
var twitterSearchClient = new Twitter.SearchClient('FkdOiZc663EQtsBJB6FhGtgE5','xPbDmVaWjRoBXUC8LpdWf1YIshxfXo0B6rWxvgAal13hI1Km3s','790315200557768704-n46IDXQuwkwV5y8TUzHiPdGfF3vjT7o','MRQISKaO9X8VHq2md9RKRJ8H86ZjlE6Et7BFA9ExWf7BD');
/*twitterStreamClient.on('close', function() {
    console.log('Connection closed.');
});
twitterStreamClient.on('end', function() {
    console.log('End of Line.');
});
twitterStreamClient.on('error', function(error) {
    console.log('Error: ' + (error.code ? error.code + ' ' + error.message : error.message));
});
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
								console.log('tweet get');
								i = 0;
								for (tmp in result.statuses)
								{
									if  (tmp == 0 && i == 1)
									{
										if (tmp == 0 && i == 0)
											i = 1;
									}
									socket.emit('tweet', {'id' : result.statuses[tmp].id, 'userName' : result.statuses[tmp].user.name, 'screenName' : result.statuses[tmp].user.screen_name, 'pic' : result.statuses[tmp].user.profile_image_url, 'text' : formatTxt(result.statuses[tmp].text)});
								}
								console.log('tweet sent');
    					}
					});
					//Quand un tweet est get on l'emet
					/*twitterStreamClient.on('tweet', function(tweet) {
										socket.emit('tweet', tweet);
										//console.log(tweet);
										console.log('tweet.');
					});
					twitterStreamClient.start([cnf]);*/
					console.log("connection");
				});
server.listen(8080);
