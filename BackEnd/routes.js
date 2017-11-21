import express from 'express';
import config from './config';
import DB from './db';

const router = express.Router();

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

router.get('/users', (req, res, next) => {
	res.send("hi");
});

router.post('/users', (req, res) => {
	var uid = req.params.UID;
	console.log(uid);
  res.json({
    response: 'a POST request for CREATING users',
    userid: uid,
    // question: req.params.UID,
    body: req.body
  });
  res.send("POST request");
});

module.exports = router;
