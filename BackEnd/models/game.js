import mongoose, { Schema } from 'mongoose';

var gameSchema = new Schema({
    game-code: {
	type: String,
	unique: true,
    },
    organizer-name: String,
    central-safe-zone: { type: Schema.Types.ObjectId, ref: 'safe-zone' },
    players: [{ type: Schema.Types.ObjectId, ref: 'player' }],
});

export default mongoose.model('game', gameSchema);
