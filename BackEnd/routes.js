import express from 'express';
import config from './config';
import mongoose from 'mongoose';
import Player from './models/player';
import Game from './models/game';
import Safezone from './models/safezone';

const router = express.Router();

var mongoDB = config.client.mongodb.defaultUri + '/' + config.client.mongodb.defaultDatabase;
mongoose.connect(mongoDB, {
    useMongoClient: true
});

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

router.get('/', (req, res, next) => {
    var test = {
	"AppName": "Bluetooth Assassin",
	"Version": 1.0
    }
    res.json(test);
});

router.get('/config', (req, res, next) => {
    res.json(config.client);
});

router.post('/createGame', (req, res) => {
    if (req.body.loginCode == null || req.body.orgName == null) {
	res.sendStatus(400);
	return;
    }
    Game.findOne({ gameCode: req.body.loginCode }, (err, game) => {
	if (game)
	    res.sendStatus(400);
	else {
		var newSafezone = new Safezone({location: [req.body.xCoord, req.body.yCord],
			radius: req.body.radius});
		
	    var newGame = new Game({ gameCode: req.body.loginCode,
				     started: false,
				     organizerName: req.body.orgName,
				     centralSafeZone: newSafezone._id});
	    newSafezone.game = newGame._id;
	    newGame.save((err) => {
		if (err)
		    res.sendStatus(500);
		else {
			newSafezone.save((err => {
				if (err)
					res.sendStatus(500)
			}));
		    res.sendStatus(200);
		}
	    });
	}
    });
});

router.post('/addUser', (req, res) => {
    if(req.body.username == null || req.body.loginCode == null || req.body.mac == null
       || req.body.x == null || req.body.y == null) {
	res.sendStatus(400);
	return;
    }
    Player.findOne({ username: req.body.username }, (err, obj) => {
	if (obj)
	    res.sendStatus(400);
	else {
	    Game.findOne({ gameCode: req.body.loginCode, started: false }, (err, game) => {
		if(!game)
		    res.sendStatus(400);
		else {
			var newSafezone = new Safezone({location: [req.body.xCoord, req.body.yCord],
			radius: req.body.radius});
		
		    var newPlayer = new Player({ username: req.body.username,
						 alive: true,
						 macAddress: req.body.mac,
						 game: game._id,
						 mySafeZone: newSafezone._id,
						 location: [req.body.x, req.body.y] });
		    newSafezone.game = game._id;
		    newPlayer.save((err, player) => {
			if (err)
			    res.sendStatus(500);
			else {
			    game.alivePlayers.push(player._id);
			    game.save((err) => {
				if (err)
				    res.sendStatus(500);
				else {
					newSafezone.save((err) => {
						if (err)
							res.sendStatus(500);
					});
				    res.status(200).send(player._id);
				}
			    });
			}
		    });
		}
	    });
	}
    });
});

// Fisher-Yates Shuffle algorithm thanks to StackOverflow
// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

	// Pick a remaining element...
	randomIndex = Math.floor(Math.random() * currentIndex);
	currentIndex -= 1;

	// And swap it with the current element.
	temporaryValue = array[currentIndex];
	array[currentIndex] = array[randomIndex];
	array[randomIndex] = temporaryValue;
    }

    return array;
}

router.post('/startGame', (req, res) => {
    if(req.body.loginCode == null) {
	res.sendStatus(400);
	return;
    }
    Game.findOne({ gameCode: req.body.loginCode, started: false }, (err, game) => {
	shuffle(game.alivePlayers);
	for(var i = 0, len = game.alivePlayers.length; i < len - 1; i++) {
	    Player.findOneAndUpdate({ _id: game.alivePlayers[i] },
				    { $set: { target: game.alivePlayers[i + 1] } },
				    (err, doc) => {
					if (err) {
					    console.log("Failed to add target to player");
					}
				    });
	}
	Player.findOneAndUpdate({ _id: game.alivePlayers[game.alivePlayers.length - 1]},
				{ $set: { target: game.alivePlayers[0] } },
				(err, doc) => {
				    if (err) {
					console.log("Failed to add target to player");
				    }
				});
	game.started = true;
	game.save((err) => {
	    if (err)
		res.sendStatus(500);
	    else
		res.sendStatus(200);
	});
    });
});

router.post('/updateLocation', (req, res) => {
    if(req.body.username == null || req.body.x == null || req.body.y == null) {
	res.sendStatus(400);
	return;
    }
    Player.findOneAndUpdate({ username: req.body.username },
			    { $set: { location: [req.body.x, req.body.y] } },
			    (err, doc) => {
				if (err)
				    res.send(err);
				else
				    res.sendStatus(200);
			    });
});

router.get('/getTargetLocation', (req, res) => {
    Player.findOne({ username: req.query.username }, (err, obj) => {
	if (err)
	    res.send(err);
	else {
	    res.send(obj.location);
	}
    });
});

module.exports = router;
