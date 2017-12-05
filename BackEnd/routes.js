import express from 'express';
import config from './config';
import mongoose from 'mongoose';
import Player from './models/player';
import Game from './models/game';
import Safezone from './models/safezone';
const _  = require('lodash')
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
    res.status(200).json(test);
});

router.get('/config', (req, res, next) => {
    res.json(config.client);
});

const validateKillRequest = request => {
	const body = request.body
	return _.has(body, 'username')
}

function checkTargetProximity(player, target) {
	console.log("checking proximity")
	var safezoneA = target.x - target.xCoord
	console.log(safezoneA)
	var safezoneB = target.y - target.yCoord
	console.log(safezoneB)
	var inSafezone = Math.sqrt(safezoneA*safezoneA + safezoneB*safezoneB)
	console.log(inSafezone)
	if (inSafezone < target.radius) {
		console.log("target is in safezone")
		return false
	}
	var a = player.x - target.x
	var b = player.y - target.y
	var dist = Math.sqrt(a*a + b*b)
	console.log(dist)
	if (dist < 10) {
		console.log("target is in proximity")
		return true
	}
	console.log("target too far")
	return false
}

router.post('/killTarget', (req, res) => {
	if (!validateKillRequest(req)) {
		console.log('failed to validate')
		res.status(400).json({
			error: 'Must have username specified',
		});
		return;
	}
	console.log('request validated')
    Player.findOne({ username: req.body.username }, (err, player) => {
	if (!player) 
		    res.status(400).json({
			error: 'Player does not exist',
		});
	else {
		Player.findOne(player.target, (err, target) => {
		if(!target)
		    res.status(400).json({
			error: 'Player\'s target does not exist',
		});
		else {
			console.log("found target")
			//check coordinate distance and safezones
			if (checkTargetProximity(player, target)) {
				console.log("target in range")
				//kill target, send notifications

				//update game player status

				//update with new target

			}
			//TODO: alliance checks
			res.status(200).json({
							message: 'success',
						})
		}
	    });
	}
    });
});

const validateGameRequest = request => {
	const body = request.body
	console.log('the body keys');
	console.log(_.keys(body));
	return _.has(body, 'loginCode') 
		&& _.has(body, 'orgName') 
}
router.post('/createGame', (req, res) => {
	if (!validateGameRequest(req)) {
		console.log('failed to validate')
		res.status(400).json({
			error: 'Must have both login code and orgName specified',
		});
		return;
	}
	console.log('request validated')
    Game.findOne({ gameCode: req.body.loginCode }, (err, game) => {
    	if (game) {
    		res.status(400).send({
    			error: "Game with login code " + req.body.loginCode + " already exists!",
    		});
    	}
		else {
			//create default x and yCoords if the req.body does not have them
			req.body.xCoord = req.body.xCoord || 2;
			req.body.yCoord = req.body.yCoord || 2;
			var newSafezone = new Safezone({location: [req.body.xCoord, req.body.yCoord],
				radius: req.body.radius});
	    	var newGame = new Game({ gameCode: req.body.loginCode,
					     started: false,
					     organizerName: req.body.orgName,
					     centralSafeZone: newSafezone._id});
	    	newSafezone.game = newGame._id;
	    	newGame.save((err) => {
	    		if (err) {
	    			res.status(500).json({
	    				error: 'there was an error with newGame',
	    			})
	    		}
			else {
				newSafezone.save((err => {
					if (err) {
						console.log(err);
						res.status(500).json({
							error: 'error with SafeZone',
						})
					}
					else {
						res.status(200).json({
							message: 'success',
						})
					}
				}));
			}
	    	});
		}
    	});
});

const validateUserRequest = request => {
	const body = request.body
	return _.has(body, 'username')
		&& _.has(body, 'loginCode')
		&& _.has(body, 'mac')
		&& _.has(body, 'x')
		&& _.has(body, 'y')
}
router.post('/addUser', (req, res) => {
	if (!validateUserRequest(req)) {
		res.status(400).json({
			error: 'Request object must contain username loginCode mac x and y',
		});
	}
	console.log('HERE IN ADD USER')
    Player.findOne({ username: req.body.username }, (err, obj) => {
    	if(obj) {
    		res.status(400).json({
    			error: 'Player with username ' + req.body.username + ' already exists',
    		});
    	}
		else {
	    	Game.findOne({ gameCode: req.body.loginCode, started: false }, (err, game) => {
	    		if(!game) {
	    			res.status(400).json({
	    				error: 'Did not find game with login code ' + req.body.loginCode,
	    			})
	    		}
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
		    	let playerId;
		    	console.log('calling new player.save');
		    	//this code is wrong, but seems to work.
		    	newPlayer.save((err, player) => {
		    		playerId = player._id;
		    		if (err) {
		    			res.status(500).json({
		    				error: 'error with player',
		    			});
		    		}
		    		console.log('had no error')
		    	}).then(player => {
		    		console.log(player)
		    		console.log('in this thingy')
		    		game.alivePlayers.push(player._id);
		    		game.save(err => {
		    			if (err) {
		    				res.status(500).json({
		    					error: 'error saving game',
		    				});
		    			}
		    			else {
		    				res.status(200).json({
		    					id: player._id,
		    				});
		    			}
		    		});
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
