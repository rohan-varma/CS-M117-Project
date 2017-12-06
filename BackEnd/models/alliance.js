import mongoose, { Schema } from 'mongoose';

var dictSchema = new Schema({
	ally: { type: Schema.Types.ObjectId, ref: 'player' },
	target: { type: Schema.Types.ObjectId, ref: 'player' },
})

var allianceSchema = new Schema({
	allies: [{ type: Schema.Types.ObjectId, ref: 'player' }],
	targets: [{ type: Schema.Types.ObjectId, ref: 'player' }],
	dictionary: { type: [dictSchema], default: [] },
});

export default mongoose.model('alliance', allianceSchema);
