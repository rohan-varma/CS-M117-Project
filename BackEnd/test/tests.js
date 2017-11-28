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
		.send({
			// loginCode: 'rohan1',
			// orgName: 'rohan',
		})
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