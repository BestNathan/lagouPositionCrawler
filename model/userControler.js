const User = require('./userModel')

function findByUserId(
	userId,
	{ populateCompany = false, populatePositions = false, positionLimit = 10, positionSkip = 0 }
) {
	return new Promise((resolve, reject) => {
		let query = User.findOne({
			userId
		}).select('-_id -__v')

		if (populateCompany) {
			query.populate('company', '-_id -__v')
		}

		if (populatePositions) {
			query.populate({
				path: 'positions',
				select: '-_id -__v',
				options: {
					limit: positionLimit,
					skip: positionSkip
				}
			})
		}

		query.exec((err, doc) => {
			if (err) {
				reject(err)
			} else {
				resolve(doc)
			}
		})
	})
}

function insertUser({ userId, realName, positionName, userLevel, positions = [], company }) {
	return new Promise((resolve, reject) => {
		if (!userId) {
			reject(new Error('userId must not be null or undefined'))
			return
		}

		User.findOneAndUpdate(
			{
				userId
			},
			arguments[0],
			{
				upsert: true,
				new: true
			},
			(err, doc, res) => {
				if (err) {
					reject(err)
				} else {
					resolve(doc)
				}
			}
		)
	})
}

async function insertUsers(users) {
	let len = users.length
	let results = []

	if (!Array.isArray(users)) {
		let res = await insertUser(users)
		return [res]
	}

	async function next(i) {
		if (i < len) {
			try {
				let res = await insertUser(users[i])
				results.push(res)
			} catch (e) {
				results.push(e)
			}

			return next(i + 1)
		} else {
			return results
		}
	}

	return next(0)
}

function addCompanyToUser(userId, company) {
	return new Promise((resolve, reject) => {
		if (!userId) {
			reject(new Error('userId must not be null or undefined '))
			return
		}

		User.findOneAndUpdate({ userId }, { company }, { new: true }, (err, doc) => {
			if (err) {
				reject(err)
			} else {
				resolve(doc)
			}
		})
	})
}

function pushPositionToUser(userId, position) {
	return new Promise((resolve, reject) => {
		if (!userId) {
			reject(new Error('userId must not be null or undefined '))
			return
		}

		User.findOneAndUpdate({ userId }, { $push: { positions: position } }, { new: true }, (err, doc) => {
			if (err) {
				reject(err)
			} else {
				resolve(doc)
			}
		})
	})
}

module.exports = {
	findByUserId,
	insertUser,
	insertUsers,
	addCompanyToUser,
	pushPositionToUser
}
