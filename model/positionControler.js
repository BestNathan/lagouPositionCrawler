const Position = require('./positionModel')

function findByPositionId(positionId, { populateUser = false, populateCompany = false }) {
	return new Promise((resolve, reject) => {
		let query = Position.findOne({
			positionId
		}).select('-_id -__v')

		if (populateUser) {
			query.populate('user', '-_id -__v')
		}

		if (populateCompany) {
			query.populate('company', '-_id -__v')
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

function insertPosition({
	positionId,
	positionAdvantage,
	positionLables,
	positionName,
	createTime,
	salary,
	education,
	workYear,
	jobNature,
	city,
	businessZones,
	district,
	firstType,
	secondType,
	positions = [],
	user
}) {
	return new Promise((resolve, reject) => {
		if (!positionId) {
			reject(new Error('positionId must not be null or undefined'))
			return
		}

		Position.findOneAndUpdate(
			{
				positionId
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

async function insertPositions(positions) {
	let len = positions.length
	let results = []

	if (!Array.isArray(positions)) {
		let res = await insertPosition(positions)
		return [res]
	}

	async function next(i) {
		if (i < len) {
			try {
				let res = await insertPosition(positions[i])
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

function addUserToPosition(positionId, user) {
	return new Promise((resolve, reject) => {
		if (!positionId) {
			reject(new Error('positionId must not be null or undefined '))
			return
		}

		Position.findOneAndUpdate({ positionId }, { user }, { new: true }, (err, doc) => {
			if (err) {
				reject(err)
			} else {
				resolve(doc)
			}
		})
	})
}

function addCompanyToPosition(positionId, company) {
	return new Promise((resolve, reject) => {
		if (!positionId) {
			reject(new Error('positionId must not be null or undefined '))
			return
		}

		Position.findOneAndUpdate({ positionId }, { company }, { new: true }, (err, doc) => {
			if (err) {
				reject(err)
			} else {
				resolve(doc)
			}
		})
	})
}

module.exports = {
	findByPositionId,
    insertPosition,
    insertPositions,
	addUserToPosition,
	addCompanyToPosition
}
