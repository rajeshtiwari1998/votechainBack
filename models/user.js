/** @format */

const mongoose = require('mongoose');

const { v4: uuid4 } = require('uuid');

const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
	name: String,
	reviews: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Review',
		},
	],
	email: {
		type: String,
		trim: true,
		unique: true,
		required: true,
	},

	safe_password: {
		type: String,
		required: true,
	},
	pancard: {
		type: String,
		unique: true,
		minlength: 10,
		maxlength: 10,
		validate: {
			validator: function (v) {
				return /([A-Z]){5}([0-9]){4}([A-Z]){1}$/.test(v);
			},
			message: () => `Invalid Pan card Number`,
		},
	},

	salt: String,

	role: {
		type: Number,
		default: 0,
	},
});

UserSchema.virtual('password')
	.get(function () {
		return this._password;
	})
	.set(function (password) {
		this._password = password;
		this.salt = uuid4();
		this.safe_password = this.securePassword(password);
	});

UserSchema.methods = {
	authenticate: function (password) {
		return this.securePassword(password) === this.safe_password;
	},
	securePassword: function (password) {
		if (!password) return '';
		try {
			/**
			 * HMACK = Hash-based Message Authentication Code
			 */
			return crypto
				.createHmac('sha256', this.salt)
				.update(password)
				.digest('hex');
		} catch (e) {
			return '';
		}
	},
};
module.exports = mongoose.model('User', UserSchema);
