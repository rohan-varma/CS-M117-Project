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

module.exports = router;
