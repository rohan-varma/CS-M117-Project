import mongoose, { Schema } from 'mongoose';

var playerSchema = new Schema({
    username: {
	type: String,
	unique: true,
    },
    alive: Boolean,
    mac-address: String,
    game: [{ type: Schema.Types.ObjectId, ref: 'game' }],
    my-safe-zone: { type Schema.Types.ObjectId, ref: 'safezone' },
    target: { type Schema.Types.ObjectId, ref: 'player' },
    alliance: { type Schema.Types.ObjectId, ref: 'alliance' },
    location: {
	type: "Point",
	coordinates: [x, y]
    },
});

export default mongoose.model('player', playerSchema);
