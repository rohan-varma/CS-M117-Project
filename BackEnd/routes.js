import express from 'express';
import config from './config';
import mongoose from 'mongoose';
import Player from './models/player';
import Game from './models/game';

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
    res.json(test);
});

router.get('/config', (req, res, next) => {
    res.json(config.client);
});

router.post('/updateLocation', (req, res) => {
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

router.post('/createGame', (req, res) => {
	var game = new Game(req.body);
	// Assuming this is from a POST request and the body of the
	// request contained the JSON of the new "todo" item to be saved
	game.save((err, createdGameObject) => {  
    if (err) {
        res.status(500).send(err);
    }
    // This createdTodoObject is the same one we saved, but after Mongo
    // added its additional properties like _id.
    res.status(200).send(createdGameObject);
});
});

module.exports = router;
