import express from 'express';
import config from './config';
import mongoose from 'mongoose';
import Player from './models/player';
import Game from './models/game';
import Safezone from './models/safezone';
import Alliance from './models/alliance';
const _  = require('lodash')

const getPlayers = (gameId, cb) => {
	Player.find({}, (err, players) => {
		if (err) {
			cb(err, {})
		}
		//get the game for the organizer? 
		Game.find({_id: gameId}, (err, game) => {
			if (err) {
				cb(err, {})
			}
			console.log(JSON.stringify(game, null, 2))
			const organizer = game.organizerName || 'organizer';
			console.log('organizer name: ', organizer)
		console.log('game id: ' + gameId);
		const thisGamePlayers = _.filter(players, p => p.gameId === gameId);
		const alivePlayers = _.filter(thisGamePlayers, p => p.alive);
		const deadPlayers = _.filter(thisGamePlayers, p => p.dead);
		console.log(JSON.stringify(thisGamePlayers, null, 2))
		const playerData = {
			message: 'success',
			players: thisGamePlayers,
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