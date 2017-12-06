import mongoose, { Schema } from 'mongoose';

var gameSchema = new Schema({
    gameCode: {
	type: String,
	unique: true,
    },
    started: Boolean,
    organizerName: String,
    centralSafeZone: { type: Schema.Types.ObjectId, ref: 'safezone' },
    alivePlayers: [{ type: Schema.Types.ObjectId, ref: 'player' }],
    deadPlayers: [{ type: Schema.Types.ObjectId, ref: 'player' }],
    hasPlayers: {type: Boolean, default: false},
});

export default mongoose.model('game', gameSchema);
