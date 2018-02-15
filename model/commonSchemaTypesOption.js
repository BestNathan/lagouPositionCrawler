const stringOptions = {
	type: String,
	set: v => (v ? v : ''),
	default: ''
}

module.exports = {
	stringOptions
}
