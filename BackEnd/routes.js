import express from 'express';
import config from './config';
import mongoose from 'mongoose';
import Player from './models/player';
import Game from './models/game';
import Safezone from './models/safezone';
import Alliance from './models/alliance';
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

function checkTargetInSafezone(player, target, callback) {
	console.log("checking safezone")
	console.log(target.username)
	console.log(target.mySafeZone)
	Safezone.findOne({_id: target.mySafeZoneId}, (err, safezone) => {
		console.log('WE FOUND A SAFEZONE HELL YEA')
		var point = { type : "Point", coordinates : safezone.location };
		console.log(point);
		var isInSafezone = false;
    	Player.geoNear(point, { maxDistance : safezone.radius, spherical : true }, function(err, results, stats) {
    	   	if(err) {
    	 		console.log(err);
    	   		return;
    	   	}
    	   	results.filter(function(value) {
    	   		if(value.obj.username == target.username) {
    	   			console.log(value.obj)
    	   			isInSafezone = true;
    	   		}
    	   	})
    	   	console.log(isInSafezone)
    	   	if(!isInSafezone) {
    	   		Game.findOne({_id: player.game}, (err, game) => {
				console.log(player.game);
				if(!game) {
					return;
				}
				else {
					Safezone.findOne({_id: game.centralSafeZone}, (err, safezone) => {
					if(!safezone) {
						console.log("couldn't find safezone")
						return;
					}
					console.log('WE FOUND A SAFEZONE HELL YEA')
					var point = { type : "Point", coordinates : safezone.location };
					console.log(point);
			    	Player.geoNear(point, { maxDistance : safezone.radius, spherical : true }, function(err, results, stats) {
			    	   	if(err) {
    				 		console.log(err);
    				   		return;
  				  	   	}
    			   	results.filter(function(value) {
    	   				if(value.obj.username == target.username) {
   			 	   			console.log("found match "+value.obj)
    	   					isInSafezone = true;
    	  		 		}
    	   			})
    	   			console.log("inSafezone before return: "+isInSafezone)
    				callback(err, isInSafezone);
					});
					});
    	   		}
    	   		});
    	   	}
    	   	else {
    	   		console.log("inSafezone before return: "+isInSafezone)
    			callback(err, isInSafezone);
    	   	}
    	});		
	});
}

function checkTargetProximity(player, target, callback) {
	console.log("checking proximity")
	console.log(target.username)
	var point = { type : "Point", coordinates : player.location };
	console.log(point);
	var isInRange = false;
    Player.geoNear(point, { maxDistance : 5, spherical : true }, function(err, results, stats) {
       	if(err) {
     		console.log(err);
       		return false;
       	}
       	results.filter(function(value) {
       		if(value.obj.username == target.username) {
       			console.log(value.obj)
       			isInRange = true;
       		}
       	})
       	console.log(isInRange)
       	callback(err, isInRange);
    });
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
			//check target safezones
			checkTargetInSafezone(player, target, (err, inSafezone) => {
				if(err) {
							res.status(500).json({
		    					error: 'error with computing proximity',
		    				});
						}
				if(inSafezone) {
					console.log("target in safezone");
					res.status(200).json({
										message: 'target in safezone',
									});
				}
				else {
					//check coordinate distance
					checkTargetProximity(player, target, (err, inRange) => {
						if(err) {
							res.status(500).json({
		    					error: 'error with computing proximity',
		    				});
						}
						if(inRange) {
							console.log("target in range")
							//kill target (update their data), send notifications
							//give assassin new target
							player.target = target.target;
							target.alive = false;
							player.save((err) => {
								if(err) {
									res.status(500).json({
				    					error: 'error with player',
		    						});
								}
							}).then(target.save((err) => {
								if(err) {
									res.status(500).json({
		    							error: 'error with player',
		    						});		
								}
								console.log("updated player and target");
							})).then(
								//update game player status
								Game.findOne({_id: player.game}, (err, game) => {
									console.log(player.game);
									if(!game) {
										res.status(400).json({
	    									error: 'Did not find game with login code ' + player.game,
	    								})
									}
									console.log(game.gameCode);
									console.log(game.alivePlayers);
									var updatedPlayers = game.alivePlayers.filter(function(value) {
										console.log(value+" target: "+target._id);
										if(value.toString() == target._id.toString()) {
       										console.log("found value: "+value);
       										game.deadPlayers.push(value)
    	   								}
       									return value.toString() != target._id.toString()
       								});
   									console.log("filtered alivePlayers array")
   									console.log(updatedPlayers)
   									game.alivePlayers = updatedPlayers
   									console.log(game.alivePlayers)
   									if(err)
   										res.status(500).json({
	   										error: 'error with updating game state',
			   							});
    								game.save((err) => {
       								if(err)
       									res.status(500).json({
		    								error: 'error with saving game',
		    							});
       								else {
       									console.log("updated game");
       									res.status(200).json({
											message: 'killed target',
										})
       								}
       							})
							}));					
						} else {
							res.status(200).json({
								message: 'target not in range',
							})
						}
					})
				}
			//TODO: alliance checks
			});
	    }
		})
    }
	});
});

const validateGameExists = request => {
  return _.has(request.body, 'loginCode');
}

router.get('/gameExists', (req, res) => {
    if (!validateGameExists(req)) {
	res.status(400).json({
	    error: 'Must provide login code'
	});
	return
    }
    const body = req.body;
    Game.findOne({ gameCode: body.loginCode }, (err, game) => {
	if (game)
	    res.status(200).send({
		message: 'success',
		exists: true
	    });
	else
	    res.status(200).send({
		message: 'success',
		exists: false
	    });
    })
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
				radius: 5});
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
							id: newGame._id,
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
	    return;
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
				req.body.xCoord = req.body.xCoord || 2;
				req.body.yCoord = req.body.yCoord || 2;
				var newSafezone = new Safezone({location: [req.body.xCoord, req.body.yCoord],
				radius: req.body.radius});

        var newPlayer = new Player({ username: req.body.username,
						 alive: true,
						 macAddress: req.body.mac,
						 game: game._id, //not sure how to use this
						 gameId: game._id,
						 mySafeZone: newSafezone._id,
						 mySafeZoneId: newSafezone._id,
						 location: [req.body.x, req.body.y] });
		    	newSafezone.game = game._id;
		    	let playerId;
		    	console.log('calling new player.save');
		    	//this code is wrong, but seems to work.
		    	newPlayer.save((err, player) => {
		    		if (err) {
		    			console.log('some error with player')
		    			res.status(400).json({
		    				error: 'error with saving player',
		    			});
		    		}
		    		console.log('the player')
		    		console.log(JSON.stringify(player, null, 2))
		    		playerId = player._id;
		    		game.alivePlayers.push(player)
		    		game.save(err => {
		    			if (err) {
		    				console.log('err saving game')
		    				res.status(400).json({error: 'error saving game'})
		    			} else {
		    				newSafezone.save(err => {
		    					if (err) {
		    						console.log(err)
		    						console.log('error saving safezone')
		    						res.status(400).json({error: 'saving savezone'})
		    					} else {
		    						res.status(200).json({message: 'success', id: playerId})
		    					}
		    				})
		    			}
		    		})
		    	})
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
	    res.status(200).json({ message: 'success',
				   location: obj.location });
	}
    });
});

const validateGetUsername = request => {
    const body = request.body;
    return _.has(body, 'id');
}

router.get('/getUsername', (req, res) => {
    if(!validateGetUsername(req)) {
	res.status(400).json({
	    error: 'Request object must contain id'
	});
	return;
    }
    const body = req.body;
    Player.findOne({ _id: body.id }, (err, player) => {
	if (err)
	    res.send(err);
	else {
	    res.status(200).json({ message: 'success',
				   username: player.username });
	}
    });
});

const validateGetTargets = request => {
    const body = request.body;
    return _.has(body, 'username');
}

router.get('/getTargets', (req, res) => {
    if (!validateGetTargets(req)) {
	res.status(400).json({
	    error: 'Request object must contain username'
	});
	return;
    }
    const body = req.body;
    Player.findOne({ username: req.body.username }, (err, player) => {
	if (err)
	    res.send(err);
	else {
	    if (player.alliance == null)
		res.status(200).json({ targets: [player.target] });
	    else {
		Alliance.findOne({ _id: player.alliance }, (err, a) => {
		    if (err)
			res.send(err);
		    else
			res.status(200).json({ message: 'success',
					       targets: a.targets });
		});
	    }
	}
    });
});

/**
 * @api {post} /createAlliance Create Alliance
 *
 * @apiParam {String} username		            The id of the invitation
 * @apiParam {String} allianceName            The email address of the invitee
 *
 * @apiExample {json} Example json input:
 *    {
 *      "username": "joebruin",
 *      "allianceName": "UCLA Alliance"
 *    }
 *
 * @apiUse Response200
 * @apiSuccessExample {json} Success example
 *    {
 *      "allianceId": allianceId,
 *    }
 *
 * @apiUse Error400
 * @apiError (Error400) 400 Failed to create alliance
 *
 */
router.post('/createAlliance', (req, res) => {
	var jsonRequestBody = req.body;

	var findCreatorPromise = Player.findOne({ username: jsonRequestBody.username }).exec();

	var createAlliancePromise = findCreatorPromise.then((creator) => {
		if (!creator) {
			throw new Error("creator not found");
		}

		var allianceFields = {};
		allianceFields.name = jsonRequestBody.allianceName;
		allianceFields.allies = [creator._id];
		allianceFields.targets = [creator.target];

		var alliance = new Alliance(allianceFields);
		var allianceId = alliance._id;
		creator.alliance = allianceId;

		// Saves new alliance and updates the creator's alliance field
		var promisesArray = [alliance.save(), creator.save()];

		return Promise.all(promisesArray);
	});

	createAlliancePromise.then(() => {
		// Success
		console.log(jsonRequestBody.username + " successfully created the alliance: " + jsonRequestBody.allianceName)
		res.status(200).json({
			"allianceId": allianceId,
		});
	}).catch((err) => {
		// Failed to create alliance
		console.log("Failed to add users to a new alliance - Error: " + err.message);
		res.status(400).json({
			error: "Failed to add users to a new alliance - Error: " + err.message,
		});
	});
});

/**
 * @api {post} /joinAlliance Join Alliance
 *
 * @apiParam {String} allianceId 	            The email address of the invitee
 *
 * @apiExample {json} Example json input:
 *    {
 *      "allianceId": allianceId,
 *    }
 *
 * @apiUse Response200
 * @apiSuccessExample {json} Success example
 *    {
 *      "allianceName": allianceName,
 *    }
 *
 * @apiUse Error400
 * @apiError (Error400) 400 Failed to create alliance
 *
 */
router.post('/joinAlliance', (req, res) => {
	var jsonRequestBody = req.body;

	var findAlliancePromise = Alliance.findOne()
})

router.post('/players', (req, res) => {
	const body = req.body
	const gameId = body.gameId
	Player.find({}, (err, players) => {
		if (err) {
			res.status(400).json({
				error: 'error finding players',
			})
		}
		//get the game for the organizer? 
		Game.find({_id: gameId}, (err, game) => {
			if (err) {
				res.status(400).json({
					error: 'error finding game',
				});
			}
			console.log(JSON.stringify(game, null, 2))
			const organizer = game.organizerName;
			console.log('organizer name: ', organizer)
			console.log('number of players: ', players.length);
		console.log('game id: ' + gameId);
		const thisGamePlayers = _.filter(players, p => p.gameId === gameId);
		const alivePlayers = _.filter(thisGamePlayers, p => p.alive);
		const deadPlayers = _.filter(thisGamePlayers, p => p.dead);
		console.log(JSON.stringify(thisGamePlayers, null, 2))
		res.status(200).json({
			message: 'success',
			players: thisGamePlayers,
			alivePlayers,
			deadPlayers,
			organizer,
		});
		})
	});
});

module.exports = router;
