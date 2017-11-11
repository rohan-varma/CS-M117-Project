import mongoose, { Schema } from 'mongoose';

var playerSchema = new Schema({
    username: {
	type: String,
	unique: true,
    },
    alive: Boolean,
    mac-address: String,
    game: [{ type: Schema.Types.ObjectId, ref: 'game' }],
    my-safe-zone: { type Schema.Types.ObjectId, ref: 'safe-zone' },
    target: { type Schema.Types.ObjectId, ref: 'player' },
    location: {
	type: "Point",
	coordinates: [x, y]
    },
});

export default mongoose.model('player', playerSchema);
