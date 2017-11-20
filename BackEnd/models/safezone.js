import mongoose, { Schema } from 'mongoose';

var safezoneSchema = new Schema({
    game: [{ type: Schema.Types.ObjectId, ref: 'game' }],
    location: {
	type: [Number],
	index: '2dsphere'
    },
    radius: Number
});

export default mongoose.model('safezone', safezoneSchema);
