import express from 'express';
import config from './config';
import mongoose from 'mongoose';
import Player from './models/player';
import Game from './models/game';
import Safezone from './models/safezone';
import Alliance from './models/alliance';
const _  = require('lodash')
const router = express.Router();
const { getPlayers } = require('./controllers.js')

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

const disbandAlliance = (allianceId, callback) => {
	Alliance.findById(allianceId).then(alliance => {
		if (!alliance) {
			throw new Error("alliance not found");
		}

		// Set every player in alliance's alliance field to empty string
		let updatePlayerAlliancePromises = alliance.allies.map(allyId => {
			return Player.findByIdAndUpdate(allyId, { alliance: "" }).exec();
		});

		return Promise.all(updatePlayerAlliancePromises);
	}).then(() => {
		// Remove the alliance document
		return Alliance.findByIdAndRemove(allianceId).exec();
	}).then(() => {
		// Success
		callback(null);
	}).catch(err => {
		// Failed -> pass error to callback
		callback(err);
	});
}

const validateKillRequest = request => {
	const body = request.body
	return _.has(body, 'username')
}

function checkTargetInSafezone(player, target, callback) {
	console.log("checking safezone")
	console.log(target.username)
	console.log(target.mySafeZone)
	Safezone.findOne({_id: target.mySafeZoneId}, (err, safezone) => {
		if(!safezone) {
			let newError = new Error('Did not find safezone with id ' + target.mySafeZoneId);
			callback(newError, null);
		}
		console.log('WE FOUND A SAFEZONE HELL YEA')
		var point = { type : "Point", coordinates : safezone.location };
		console.log(point);
		var isInSafezone = false;
		Player.geoNear(point, { maxDistance : safezone.radius, spherical : true }, function(err, results, stats) {
			if(err) {
				console.log(err);
				callback(err, null)
			}
			results.filter(function(value) {
				if(value.obj.username === target.username) {
					console.log(value.obj)
					isInSafezone = true;
				}
			})
			console.log(isInSafezone)
			if(!isInSafezone) {
				Game.findOne({_id: player.game}, (err, game) => {
				console.log(player.game);
				if(err || !game) {
					callback(err ? err : 'could not find game', null)
				}
				else {
					Safezone.findOne({_id: game.centralSafeZone}, (err, safezone) => {
					if(err || !safezone) {
						callback(err ? err : 'could not find safezone', null)
					}
					console.log('WE FOUND A SAFEZONE HELL YEA')
					var point = { type : "Point", coordinates : safezone.location };
					console.log(point);
					Player.geoNear(point, { maxDistance : safezone.radius, spherical : true }, function(err, results, stats) {
						if(err) {
							console.log(err)
							cb(err, null)
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

function killTargetAttempt(player, target, assassin, callback) {
	//check target safezones
	checkTargetInSafezone(player, target, (err, inSafezone) => {
		if(err) {
			callback(err, null)
		}
		if(inSafezone) {
			console.log("target in safezone");
			callback(null, 'target in safezone')
		}
		else {
			console.log('in safezone or not: ', inSafezone)
			//check coordinate distance
			checkTargetProximity(player, target, (err, inRange) => {
				if(err) {
					callback(err, null)
				}
				if(inRange) {
					console.log("target in range")
					//kill target (update their data), send notifications
					//give assassin new target
					if(assassin) {
						assassin.target = target.target
						assassin.save((err) => {
							if(err) {
								callback(err, null)
							}
						})
					} else {
						player.target = target.target
					}
					target.alive = false;
					player.save((err) => {
						if(err) {
							callback(err, null)
						}
					}).then(target.save((err) => {
						if(err) {
							callback(err, null)
						}
						console.log("updated player and target");
					})).then(
						//update game player status
						Game.findOne({_id: player.game}, (err, game) => {
							console.log(player.game);
							if(!game) {
								let newError = new Error('Did not find game with login code ' + player.game);
								callback(newError, null)
							}
							console.log(game.gameCode);
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
							game.save((err) => {
								if(err)
									callback(err, null)
								else {
									console.log("updated game");
									callback(null, 'killed target')
								}
							})
						}));					
					} else {
						callback(null, 'target not in range')
					}
			})
		}
	});
}

const validateSafezoneRequest = request => {
    return _.has(request.body, 'username')
	&& _.has(request.body, 'loginCode');
}

router.post('/organizerName', (req, res) => {
    if(!_.has(req.body, 'loginCode')) {
	res.status(400).json({
	    error: 'Must have loginCode specified'
	});
	return;
    }
    Game.findOne({ gameCode: req.body.loginCode }, (err, game) => {
	if(!game)
	    res.status(400).json({
		error: 'Game does not exist'
	    });
	else {
	    res.status(200).json({
		message: 'success',
		organizerName: game.organizerName
	    });
	}
    });
});

function shrinkSafezone (req, res, cb) {
	if(!_.has(req.body, 'loginCode')) {
		const err = {err: 'must have login code defined'}
		cb(err,'Must have loginCode specified')
    }
    Game.findOne({ gameCode: req.body.loginCode }, (err, game) => {
		if(!game)
		    cb(err,'Game does not exist')
		else {
			console.log('game before calling safezone find one')
			console.log(JSON.stringify(game, null, 2))
			Safezone.findOne({ _id: game.centralSafeZone }, (err, safezone) => {
				if (err || !safezone) {
					cb(err ? err: 'safezone doesnt exist', null)
				}
				console.log('find one')
				console.log(err)
				console.log(JSON.stringify(safezone, null, 2))
				var numAlive = game.alivePlayers.length + 1;
				var gameSize = numAlive + game.deadPlayers.length - 1;
				if(numAlive/gameSize <= .15) {
					console.log('safezone should be empty now');
					safezone.radius = 0;
				}
				else {
					safezone.radius -= (safezone.radius/numAlive);
				}
				safezone.save((err) => {
					if(err)
						callback(err, null)
					else {
						console.log("updated safezone");
						cb(null, 'updated safezone')
					}
				})
			});
		}
    });
}

router.post('/safezoneInfo', (req, res) => {
    if (!validateSafezoneRequest(req)) {
	res.status(400).json({
	    error: 'Must have player username and game loginCode specified'
	});
	return;
    }
    Player.findOne({ username: req.body.username }, (err, player) => {
	if (!player)
	    res.status(400).json({
		error: 'Username does not exist'
	    });
	else {
	    Safezone.findOne({ _id: player.mySafeZone }, (err, psz) => {
		if (!psz)
		    res.status(400).json({
			error: 'Player does not have safezone'
		    });
		else {
		    Game.findOne({ gameCode: req.body.loginCode }, (err, game) => {
			if (!game)
			    res.status(400).json({
				error: 'Game does not exist'
			    });
			else {
			    Safezone.findOne({ _id: game.centralSafeZone }, (err, gsz) => {
				if (!gsz)
				    res.status(400).json({
					error: 'Central safezone does not exist'
				    });
				else {
				    res.status(200).json({
					message: 'success',
					psz_loc: psz.location,
					psz_radius: psz.radius,
					gsz_loc: gsz.location,
					gsz_radius: gsz.radius
				    });
				}
			    });
			}
		    });
		}
	    });
	}
    });
});

router.post('/killTarget', (req, res) => {
	if (!validateKillRequest(req)) {
		console.log('failed to validate')
		res.status(400).json({
			error: 'Must have username specified',
		});
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
				console.log(player)
				console.log(target)
				killTargetAttempt(player, target, null, (err, msg) => {
					if(err) {
						res.status(400).json({error: err.message});
					} else if (msg === 'target killed' || !player.alliance) {
						shrinkSafezone(req, res, (err, message) => {
							if (err) {
								res.status(400).json({error: err});
							} else {
								console.log("early exit")
								res.status(200).json({message: msg});
							}
						});
					} else {
						console.log('in some alliance shit for some reason')
						// Check if you can kill a target in alliance
						// Look up alliance, if found run killTargetAttempt on every target in the alliance
						Alliance.findById(player.alliance, (err, alliance) => {
							if (!alliance) {
								res.status(400).json({
									error: "alliance not found",
								});
								return;
							}  else {
								console.log(alliance.dictionary)
								var continueExecution = true;
								alliance.dictionary.forEach(element => {
									if(continueExecution && player._id !=  element.ally) {
										console.log(player)
										console.log(element.target)
										console.log(element.ally)
										
										var findTargetPromise = Player.findById(element.target).exec();
										var findAllyPromise = Player.findById(element.ally).exec();
										var allianceKillQueryPromises = [findTargetPromise, findAllyPromise];

										Promise.all(allianceKillQueryPromises).then(docs => {
											var targetDoc = docs[0];
											var allyDoc = docs[1];

											killTargetAttempt(player, targetDoc, allyDoc, (err, msg) => {
												if(err) {
													res.status(400).json({error: err.message});
													continueExecution = false;
													return;
												} else if(msg === 'killed target') {
													console.log('killed alliance target!')
													shrinkSafezone(req, res, (err, msg) => {
														if(err)
															res.status(400).json({error: err.message});
													});
													res.status(200).json({
														message: msg,
													});
													continueExecution = false;
													return;
												}
											});
										}).catch(err => {
											res.status(400).json({error: err.message});
											continueExecution = false;
											return;
										});
									}
								});
							}
						});
					}
				});
			}
		});
	}
	});
});

const validateGameExists = request => {
  return _.has(request.body, 'loginCode');
}

router.post('/gameExists', (req, res) => {
	if (!validateGameExists(req)) {
	res.status(400).json({
		error: 'Must provide login code'
	});
	return
	}
	const body = req.body;
	Game.findOne({ gameCode: body.loginCode }, (err, game) => {
	if (game) {
		res.status(200).send({
		message: 'success',
		exists: true,
		started: (game.started ? true : false)
		});
	}
	else
		res.status(200).send({
		message: 'success',
		exists: false,
		started: false
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
				error: 'Player exists',
				username: req.body.username,
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
				let username;
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
					username = player.username;
					game.alivePlayers.push(player)
					game.hasPlayers = true;
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
									res.status(200).json({message: 'success', id: playerId, username: username})
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
	if(!game || err) {
	    res.status(400).json({
		error: 'Game does not exist'
	    });
	    return;
	}
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
		if (err) {
			res.status(500).json({error: 'could not save game to start it'})
		} else {
			getPlayers(game._id, (err, players) => {
				if (err) {
					res.status(400).json({error: err});
				} else {
					res.status(200).json(players);
				}
			})
		}
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


const validateGetTargets = request => {
	const body = request.body;
	return _.has(body, 'username');
}

router.post('/getTargetLocation', (req, res) => {
	if(!validateGetTargets(req)) {
		console.log('invalid request body')
		console.log(JSON.stringify(req, null, 2))
		res.status(400).json({
			error: 'body must have username',
		})
	}
	Player.findOne({ username: req.body.username }, (err, player) => {
		if (err || !player) {
			res.status(400).json({message: 'error when trying to find player'});
		}
		else {
		    console.log('FOUND THIS PLAYER')
		    console.log(JSON.stringify(player, null, 2))
		    const pIdToUsername = playerId => {
			return Player.findById(playerId);
		    }
		    if (player.alliance == null) {
                Promise.all(_.map([player.target], pIdToUsername)).then(result => {
                    var array = [];
                    var tuple = [result.username, result.location];
                    array.push(tuple);
                    var jsonArray = JSON.stringify(array);
                    res.status(200).json({
                        message: 'success',
                        targets: array
                    });
                });
            } else {
                Alliance.findOne({ _id: player.alliance }, (err, a) => {
                    if (err) {
                        res.status(400).json({error: err});
                    } else {
                        Promise.all(_.map(a.targets, pIdToUsername)).then(result => {
                            var array = [];
                            for(let i = 0; i < result.length; i++) {
                                var tuple = [result[i].username, result[i].location];
                                array.push(tuple);
                            }
                            var jsonArray = JSON.stringify(array);
                            res.status(200).json({
                                message: 'success',
                                targets: jsonArray
                            });
                        });
                    }
                });
			}
		}
	});
});

const validateGetUsername = request => {
	const body = request.body;
	return _.has(body, 'id');
}

router.post('/getUsername', (req, res) => {
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

router.post('/targets', (req, res) => {
	if (!validateGetTargets(req)) {
		console.log('YOUR SHITTY REQUEST BODY')
		console.log(JSON.stringify(req.body, null, 2))
	res.status(400).json({
		error: 'Request object must contain username',
	});
	return;
    }
    const body = req.body;
    console.log('request body')
    console.log(JSON.stringify(body, null, 2))
    Player.findOne({username: req.body.username}, (err, player) => {
	if (err || !player) {
		res.status(400).json({message: 'error when trying to find player'});
	}
	else {
	    console.log('FOUND THIS PLAYER')
	    console.log(JSON.stringify(player, null, 2))
	    const pIdToUsername = playerId => {
		return Player.findById(playerId);
	    }
	    if (player.alliance == null)
		Promise.all(_.map([player.target], pIdToUsername)).then(result => {
		    res.status(200).json({
			message: 'success',
			targets: result
		    });
		});
	    else {
		Alliance.findOne({ _id: player.alliance }, (err, a) => {
			if (err) {
				res.status(400).json({error: err});
			} else {
			    Promise.all(_.map(a.targets, pIdToUsername)).then(result => {
				res.status(200).json({
				    message: 'success',
				    targets: result
				});
			    });
			}
		});
		}
	}
	});
});

/**
 * @api {post} /createAlliance Create Alliance
 *
 * @apiParam {String} username                The username of the creator
 *
 * @apiExample {json} Example json input:
 *    {
 *      "username": "joebruin",
 *    }
 *
 * @apiUse Response200
 * @apiSuccessExample {json} Success example
 *    {
 *      "allianceId": "41224d776a326fb40f000001"
 *    }
 *
 * @apiUse Error400
 * @apiError (Error400) 400 Failed to create alliance
 *
 */
router.post('/createAlliance', (req, res) => {
	var jsonRequestBody = req.body;
	var allianceId = null;
	console.log('create alliance request body')
	console.log(JSON.stringify(jsonRequestBody, null, 2))
	Player.findOne({ username: jsonRequestBody.username }).then(creator => {
		if (!creator) {
			throw new Error("creator not found");
		}

		var allianceFields = {
			allies: [creator._id],
			targets: [creator.target],
			dictionary: [{ally: creator._id, target: creator.target}]
		};

		var alliance = new Alliance(allianceFields);
		allianceId = alliance._id;
		creator.alliance = allianceId;

		// Saves new alliance and updates the creator's alliance field
		var promisesArray = [alliance.save(), creator.save()];
		return Promise.all(promisesArray);
	}).then(() => {
		// Success
		res.status(200).json({
			"allianceId": allianceId,
		});
	}).catch(err => {
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
 * @apiParam {String} username                The username of the player
 * @apiParam {String} allianceId              The ID of the alliance to join
 *
 * @apiExample {json} Example json input:
 *    {
 *      "username": "joebruin",
 *      "allianceId": "41224d776a326fb40f000001"
 *    }
 *
 * @apiUse Response200
 *
 * @apiUse Error400
 * @apiError (Error400) 400 Failed to create alliance
 *
 */
router.post('/joinAlliance', (req, res) => {
	console.log('IN JOIN ALLIANCE')
        var jsonRequestBody = req.body;
        if(!_.has(jsonRequestBody, 'allianceId')) {
	    var allianceId = Alliance.findOne()
		.then(a => {
		    var allianceId = a._id;
		    console.log(JSON.stringify(jsonRequestBody, null, 2))
		    // Get player and alliance
		    var findPlayerPromise = Player.findOne({ username: jsonRequestBody.username }).exec();
		    var findAlliancePromise = Alliance.findById(allianceId).exec();
		    var promisesArray = [findPlayerPromise, findAlliancePromise];
		    
		    Promise.all(promisesArray).then(docs => {
			var player = docs[0];
			var alliance = docs[1];
			
			if (!player) {
			    throw new Error("player not found");
			}
			else if (!alliance) {
			    throw new Error("alliance not found");
			}
			
			// Target validation
			alliance.targets.forEach(target => {
			    if (target.equals(player._id)) {
				throw new Error("player is a target of someone within the alliance");
			    }
			});
			
			// Add player to alliance
			player.alliance = allianceId;
			alliance.allies.push(player._id);
			alliance.targets.push(player.target);
			alliance.dictionary.push({ally: player._id, target: player.target});
			
			var savePlayerPromise = player.save();
			var saveAlliancePromise = alliance.save();
			var saveDocsPromisesArray = [savePlayerPromise, saveAlliancePromise];
			
			return Promise.all(saveDocsPromisesArray);
		    }).then(() => {
			// Success
			console.log(jsonRequestBody.username + " successfully joined the alliance: " + allianceId);
			res.status(200).json({
			    allianceId: allianceId
			});
		    }).catch(err => {
			// Failed to join alliance
			console.log(jsonRequestBody.username + " failed to join an alliance - Error: " + err.message);
			res.status(400).json({
			    error: "Failed to join alliance - Error: " + err.message,
			});
		    });
		});
	} else {
	    var allianceId = jsonRequestBody.allianceId;
	    console.log(JSON.stringify(jsonRequestBody, null, 2))
	    // Get player and alliance
	    var findPlayerPromise = Player.findOne({ username: jsonRequestBody.username }).exec();
	    var findAlliancePromise = Alliance.findById(allianceId).exec();
	    var promisesArray = [findPlayerPromise, findAlliancePromise];

	    Promise.all(promisesArray).then(docs => {
		var player = docs[0];
		var alliance = docs[1];
		
		if (!player) {
		    throw new Error("player not found");
		}
		else if (!alliance) {
		    throw new Error("alliance not found");
		}
		
		// Target validation
		alliance.targets.forEach(target => {
		    if (target.equals(player._id)) {
			throw new Error("player is a target of someone within the alliance");
		    }
		});
		
		// Add player to alliance
		player.alliance = allianceId;
		alliance.allies.push(player._id);
		alliance.targets.push(player.target);
		alliance.dictionary.push({ally: player._id, target: player.target});
		
		var savePlayerPromise = player.save();
		var saveAlliancePromise = alliance.save();
		var saveDocsPromisesArray = [savePlayerPromise, saveAlliancePromise];
		
		return Promise.all(saveDocsPromisesArray);
	    }).then(() => {
		// Success
		console.log(jsonRequestBody.username + " successfully joined the alliance: " + allianceId);
	        res.status(200).json({
		    allianceId: allianceId
		});
	    }).catch(err => {
		// Failed to join alliance
		console.log(jsonRequestBody.username + " failed to join an alliance - Error: " + err.message);
		res.status(400).json({
		    error: "Failed to join alliance - Error: " + err.message,
		});
	    });
	}
});

/**
 * @api {post} /getAlliance Get a Player's Alliance Info
 *
 * @apiParam {String} username                The username of the player
 *
 * @apiExample {json} Example json input:
 *    {
 *      "username": "joebruin"
 *    }
 *
 * @apiUse Response200
 * @apiSuccessExample {json} Success example
 *    {
 *      "allianceId": "41224d776a326fb40f000001",
 *      "allies": [ ... ],
 *      "targets": [ ... ]
 *    }
 *
 * @apiUse Error400
 * @apiError (Error400) 400 Failed to create alliance
 *
 */
router.post('/getAlliance', (req, res) => {
	let jsonRequestBody = req.body;
	console.log('get alliance request body')
	console.log(JSON.stringify(jsonRequestBody, null, 2))
	Player.findOne({ username: jsonRequestBody.username }).then(player => {
		if (!player) {
			throw new Error("player not found");
		}
		let allianceId = player.alliance;
		return Alliance.findById(allianceId);
	}).then(alliance => {
		if (!alliance) {
			throw new Error("player's alliance not found");
		}
		const pIdToUsername = playerId => Player.findById(playerId)
		Promise.all(_.map(alliance.allies, pIdToUsername)).then(result => {
			Promise.all(_.map(alliance.targets, pIdToUsername)).then(targs => {
				res.status(200).json({
				message:'success',
				allies: result,
				targets: targs,
				dictionary: alliance.dictionary,
			})

			})
			});
		// res.status(200).json({
		// 	"allianceId": alliance._id,
		// 	"allies": alliance.allies,
		// 	"targets": alliance.targets,
		// 	"dictionary": alliance.dictionary,
		// });
	}).catch(err => {
		res.status(400).json({
			error: "Failed to get alliance - Error: " + err.message,
		});
	});
});

router.post('/players', (req, res) => {
	console.log ('hihihih');
	const body = req.body
	const gameCode = body.loginCode
	getPlayers(gameCode, (err, playerData) => {
		if (err) {
			res.status(400).json({error: err});
		} else {
			res.status(200).json(playerData);
		}
	});
});

module.exports = router;
