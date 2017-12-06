import express from 'express';
import config from './config';
import mongoose from 'mongoose';
import Player from './models/player';
import Game from './models/game';
import Safezone from './models/safezone';
import Alliance from './models/alliance';
const _  = require('lodash')

const getPlayers = (gameCode, cb) => {
	Player.find({}, (err, players) => {
		if (err) {
			cb(err, {})
		}
		//get the game for the organizer? 
		Game.find({gameCode: gameCode}, (err, game) => {
		    if (err) {
			cb(err, {})
		    }
		    console.log(JSON.stringify(game, null, 2))
		    const organizer = game.organizerName || 'organizer';
		    console.log('organizer name: ', organizer)
		    const pIdToUsername = playerId => {
			Players.findOne({ _id: playerId }, (err, p) => {
			    return p.username;
			});
		    }
		    const alivePlayers = _.map(game.alivePlayers, pIdToUsername);
		    const deadPlayers = _.map(game.deadPlayers, pIdToUsername);
		    const playerData = {
			message: 'success',
			players: alivePlayers.concat(deadPlayers),
			alivePlayers,
			deadPlayers,
			organizer,
		    }
		    cb(null, playerData)
		})
	});
}

module.exports = {
	getPlayers,
}
