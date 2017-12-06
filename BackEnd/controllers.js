import express from 'express';
import config from './config';
import mongoose from 'mongoose';
import Player from './models/player';
import Game from './models/game';
import Safezone from './models/safezone';
import Alliance from './models/alliance';
const _  = require('lodash')

const getPlayers = (gameCode, cb) => {
	console.log ('testing');
	Player.find({}, (err, players) => {
		if (err) {
			cb(err, {})
		}
		//get the game for the organizer? 
		Game.findOne({gameCode: gameCode}, (err, game) => {
		    if (err || !game ) {
			cb(err, {})
		    }
		    console.log(JSON.stringify(game, null, 2))
		    const organizer = game.organizerName || 'organizer';
		    console.log('organizer name: ', organizer)
		    const pIdToUsername = playerId => {
			return Player.findById(playerId);
		    }
		    const alivePlayers = _.map(game.alivePlayers, pIdToUsername);
		    const deadPlayers = _.map(game.deadPlayers, pIdToUsername);
		    Promise.all(alivePlayers).then(aPlayers => {
			Promise.all(deadPlayers).then(dPlayers => {
			    const playerData = {
				message: 'success',
				players: aPlayers.concat(dPlayers),
				alivePlayers: aPlayers,
				deadPlayers: dPlayers,
				organizer
			    }
			    cb(null, playerData)
			});
		    })
		})
	});
}

module.exports = {
	getPlayers,
}