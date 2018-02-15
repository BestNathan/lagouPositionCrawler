const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { stringOptions } = require('./commonSchemaTypesOption')

const companySchema = new Schema({
	companyId: {
		type: Number,
		index: true,
		unique: true,
		required: true
	},
	companyFullName: stringOptions,
	companyLabelList: [stringOptions],
	companyShortName: stringOptions,
	companySize: stringOptions,
	financeStage: stringOptions,
	positions: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Position'
		}
	],
	users: [
		{
			type: Schema.Types.ObjectId,
			ref: 'User'
		}
	]
})

module.exports = mongoose.model('Company', companySchema)
