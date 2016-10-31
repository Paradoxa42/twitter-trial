var app = require('express')();
var bodyParser = require('body-parser');
var server = require('http').createServer(app);
var pixi = require('pixi')

/*On read le fichier de configuration*/
var fs = require('fs');
function getCnf(){
	var cnf = fs.readFileSync('config.txt','utf8')
	cnf = cnf.replace('\n','');
	return cnf
}

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

var Twit = require('twit')

var T = new Twit({
  consumer_key:         'FkdOiZc663EQtsBJB6FhGtgE5',
  consumer_secret:      'xPbDmVaWjRoBXUC8LpdWf1YIshxfXo0B6rWxvgAal13hI1Km3s',
  access_token:         '790315200557768704-n46IDXQuwkwV5y8TUzHiPdGfF3vjT7o',
  access_token_secret:  'MRQISKaO9X8VHq2md9RKRJ8H86ZjlE6Et7BFA9ExWf7BD',
})
var stream = T.stream('statuses/filter', { track : [getCnf()]});
console.log("configuration " + getCnf());
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
					var weekAgo = new Date();
					weekAgo.setDate(weekAgo.getDate() - 7);
					//On fait d'abord une recherche des tweets de la semaine pour pas avoir un écran vide au début
					T.get('search/tweets', { q: getCnf() + ' since:' + weekAgo.getUTCFullYear() + '-' + weekAgo.getUTCMonth() + '-' + weekAgo.getUTCDate(), count: 20 }, function(err, data, response) {
  					for (tmp in data.statuses) {
							socket.emit('tweet', {'id' : data.statuses[tmp].id, 'userName' : data.statuses[tmp].user.name, 'screenName' : data.statuses[tmp].user.screen_name, 'pic' : data.statuses[tmp].user.profile_image_url, 'text' : formatTxt(data.statuses[tmp].text)});
						}
					})
					//on lance le stream et on get les tweets en temps réel et on l'envoi au client
					stream.on('tweet', function(tweet){
						socket.emit('tweet', {'id' : tweet.id, 'userName' : tweet.user.name, 'screenName' : tweet.user.screen_name, 'pic' : tweet.user.profile_image_url, 'text' : formatTxt(tweet.text)});
					})
					console.log("connection");
				});
server.listen(8080);
