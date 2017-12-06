const chai = require('chai');
const chaiHttp = require('chai-http')
const expect = chai.expect
const should = chai.should();
chai.use(chaiHttp);
const routes = require('../routes')
const server = require('../bin/www')

process.env.NODE_ENV = 'test';

describe('/config', () => {
	it('does not error on getting config', cb => {
		chai.request(server)
		.get('/BluA/config')
		.end((err,res) => {
			expect(err).to.eql(null);
			cb();
		})
	})
});


describe('/createGame', () => {

	it('body has errors when required params not specified', cb => {
		chai.request(server)
		.post('/BluA/createGame')
		.send({})
		.end((err, res) => {
			expect(err).to.eql(null);
			const body = res.body
			expect(body).to.have.keys(["error"]);
			cb();
		})
	});

	it('returns successfully when required params are present and login code is unique', cb => {
		chai.request(server)
		.post('/BluA/createGame')
		.send({
			loginCode: Math.random().toString(36).substring(15),
			orgName: 'something',
			xCoord: 2,
			yCoord: 2,
		})
		.end((err, res) => {
			expect(err).to.eql(null);
			const body = res.body
			expect(body).to.have.keys(["message"]);
			expect(body.message).to.contain('success');
			cb();
		});
	});
});

describe('addUser', () => {

	const startRequest = () => {
		return chai.request(server).post('/BluA/addUser')
	}

	it('body has error when required params not specified', cb => {
		startRequest()
		.send({})
		.end((err, res) => {
			expect(err).to.eql(null);
			const body = res.body
			expect(body).to.have.keys(['error'])
			console.log(body.error);
			cb();
		});
	});

	it('adds  user', cb => {
		// first create a game
		const code = Math.random().toString(36).substring(15);
		console.log('HERE')
		chai.request(server)
		.post('/BluA/createGame')
		.send({
			loginCode: code,
			orgName: 'something',
			xCoord: 2,
			yCoord: 2,
		})
		.end((err, res) => {
			startRequest()
		.send({
			username: Math.random().toString(36).substring(15),
			loginCode: code,
			mac: '100',
			x: 2,
			y: 2,
		})
		.end((err, res) => {
			expect(err).to.eql(null)
			const body = res.body
			console.log(JSON.stringify(body, null, 2))
			cb();
		})
		})
		console.log('HERE')
	})

});

describe('get players', () => {
	const startRequest = () => {
		return chai.request(server).post('/BluA/addUser')
	}
	it.only('can get players', cb => {
		let gameId;
		//first create game and add players
		const code = Math.random().toString(36).substring(15);
		console.log('HERE')
		chai.request(server)
		.post('/BluA/createGame')
		.send({
			loginCode: code,
			orgName: 'something',
			xCoord: 2,
			yCoord: 2,
		})
		.end((err, res) => {
			gameId = res.body.id;
			startRequest()
		.send({
			username: Math.random().toString(36).substring(15),
			loginCode: code,
			mac: '100',
			x: 2,
			y: 2,
		})
		.end((err, res) => {
			expect(err).to.eql(null)
			const body = res.body
			console.log(JSON.stringify(body, null, 2))
			//find the player here
			console.log('trying to find the player now');
			chai.request(server).post('/BluA/players').send({gameId: gameId})
			.end((err, res) => {
				const body = res.body;
				console.log(JSON.stringify(body, null, 2))
				const players = body.players;
				console.log(JSON.stringify(players,  null, 2))
				expect(players).to.have.length(1);
				cb()
			})
		})
		})
	})
})

describe('creates a game, adds users, and starts it, and displays an internal game state', () => {
	it.only('works', cb => {
			const startRequest = () => {
		return chai.request(server).post('/BluA/addUser')
	}
		// first create a game
		const code = Math.random().toString(36).substring(15);
		console.log('HERE')
		chai.request(server)
		.post('/BluA/createGame')
		.send({
			loginCode: code,
			orgName: 'something',
			xCoord: 2,
			yCoord: 2,
		})
		.end((err, res) => {
			startRequest()
		.send({
			username: Math.random().toString(36).substring(15),
			loginCode: code,
			mac: '100',
			x: 2,
			y: 2,
		})
		.end((err, res) => {
			expect(err).to.eql(null)
			const body = res.body
			console.log(JSON.stringify(body, null, 2))
			//add another player
			startRequest().send({
				username: Math.random().toString(36).substring(15),
				loginCode: code,
				mac: '100',
				x: 2,
				y: 2,
			})
			.end((err, res) => {
				const body = res.body;
				console.log('ABOUT TO CALL START GAME')
				chai.request(server).post('/BluA/startGame')
				.send({
					loginCode: code,
					orgName: 'something',
				})
				.end((err, res) => {
					console.log('did a create game thing i think')
					console.log(err);
					const body = res.body;
					console.log('body')
					console.log(JSON.stringify(body, null, 2))
					cb();
				})
			})
		})
		})
		console.log('HERE')
	})
})