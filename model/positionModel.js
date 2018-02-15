const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { stringOptions } = require('./commonSchemaTypesOption')

const positionSchema = new Schema({
	positionId: {
		type: Number,
		index: true,
		unique: true,
		required: true
	},
	positionAdvantage: stringOptions,
	positionLables: [stringOptions],
	positionName: stringOptions,
	createTime: Date,
	salary: stringOptions,
	education: stringOptions,
	workYear: stringOptions,
	jobNature: stringOptions,
	city: stringOptions,
	businessZones: [stringOptions],
	district: stringOptions,
	firstType: stringOptions,
	secondType: stringOptions,
	company: {
		type: Schema.Types.ObjectId,
		ref: 'Company'
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	}
})

module.exports = mongoose.model('Position', positionSchema)
