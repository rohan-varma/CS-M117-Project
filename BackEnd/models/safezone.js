import mongoose, { Schema } from 'mongoose';

var safezoneSchema = new Schema({
    game: [{ type: Schema.Types.ObjectId, ref: 'game' }],
    location: {
	type: "Point",
	coordinates: [x, y]
    },
    radius: Number
});

export default mongoose.model('safezone', safezoneSchema);
