import mongoose, { Schema } from 'mongoose';

var playerSchema = new Schema({
    username: {
	type: String,
	unique: true,
    },
    alive: Boolean,
    macAddress: String,
    game: [{ type: Schema.Types.ObjectId, ref: 'game' }],
    mySafeZone: { type: Schema.Types.ObjectId, ref: 'safezone' },
    target: { type: Schema.Types.ObjectId, ref: 'player' },
    alliance: { type: Schema.Types.ObjectId, ref: 'alliance' },
    location: {
	type: [Number],
	index: '2dsphere'
    },
});

export default mongoose.model('player', playerSchema);
