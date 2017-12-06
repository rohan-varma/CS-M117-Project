import mongoose, { Schema } from 'mongoose';

var allianceSchema = new Schema({
	allies: [{ type: Schema.Types.ObjectId, ref: 'player' }],
	targets: [{ type: Schema.Types.ObjectId, ref: 'player' }],
	dictionary: [{target: Schema.Types.ObjectId, ally: Schema.Types.ObjectId}],
});

export default mongoose.model('alliance', allianceSchema);
