/** @format */

const mongoose = require('mongoose');
const User = require('./user');

const ReviewSchema = new mongoose.Schema(
	{
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		comment: {
			type: String,
			required: true,
		},
		rating: { type: String },
	},
	{
		toObject: { getters: true },
		toJSON: { getters: true },
		timestamps: true,
	},
);

module.exports = mongoose.model('Review', ReviewSchema);
