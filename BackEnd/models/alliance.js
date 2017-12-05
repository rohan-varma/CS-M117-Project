import mongoose, { Schema } from 'mongoose';

var allianceSchema = new Schema({
	name: String,
	allied: [{ type: Schema.Types.ObjectId, ref: 'player' }],
	targets: [{ type: Schema.Types.ObjectId, ref: 'player' }],
});

export default mongoose.model('alliance', allianceSchema);
