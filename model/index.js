const mongoose = require('mongoose')
mongoose.Promise = Promise

const User = require('./userModel')
const Company = require('./companyModel')
const Position = require('./positionModel')

const userControler = require('./userControler')
const companyControler = require('./companyControler')
const positionControler = require('./positionControler')
const connection = mongoose.connection

function connect() {
	let env = process.env.NODE_ENV
	let db = env === 'test' ? 'lagouTest' : 'lagou'

	return mongoose.connect('mongodb://localhost/' + db)
}

function disconnect() {
	let env = process.env.NODE_ENV
	if (env === 'test') {
		return connection.dropDatabase().then(res => {
			return mongoose.disconnect()
		})
	}
	return mongoose.disconnect()
}

connection.on("open", function() {
  console.log("mongodb open");
});

connection.on('error', function() {
	console.log('mongodb error')
})

connection.on('close', function() {
	console.log('mongodb close')
})

module.exports = {
	connect,
	disconnect,
	User,
	Company,
	Position,
	userControler,
	companyControler,
	positionControler
}
