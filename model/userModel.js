const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { stringOptions } = require('./commonSchemaTypesOption')

const userSchema = new Schema({
	userId: {
		type: Number,
		index: true,
		unique: true,
		required: true
	},
	realName: stringOptions,
	positionName: stringOptions,
	userLevel: stringOptions,
	positions: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Position'
		}
	],
	company: {
		type: Schema.Types.ObjectId,
		ref: 'Company'
	}
})

module.exports = mongoose.model('User', userSchema)
