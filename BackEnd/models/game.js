import mongoose, { Schema } from 'mongoose';

var gameSchema = new Schema({
    gameCode: {
	type: String,
	unique: true,
    },
    organizerName: String,
    centralSafeZone: { type: Schema.Types.ObjectId, ref: 'safezone' },
    alivePlayers: [{ type: Schema.Types.ObjectId, ref: 'player' }],
    deadPlayers: [{ type: Schema.Types.ObjectId, ref: 'player' }],
});

export default mongoose.model('game', gameSchema);
