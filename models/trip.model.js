const { Schema, model, default: mongoose } = require('mongoose');

const tripSchema = new Schema({
	destination: { type: String, required: true, trim: true },
	category: {
		type: String,
		required: true,
		enum: ['Adventure', 'Relax', 'Nightlife', 'Culture', 'Romance'],
	},
	inStock: { type: String },
	description: { type: String, required: true, trim: true, maxlength: 300 },
	unitPrice: { type: String, required: true, min: 0 },
	tripImg: { type: String },
	dateCreated: { type: Date, default: Date.now },
});

const TripModel = model('Trip', tripSchema);

module.exports = TripModel;
