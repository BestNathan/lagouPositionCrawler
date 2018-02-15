const Company = require('./companyModel')

function findByCompanyId(
	companyId,
	{ populateUser = false, populatePositions = false, positionLimit = 10, positionSkip = 0, userLimit = 10, userSkip = 0 }
) {
	return new Promise((resolve, reject) => {
		let query = Company.findOne({
			companyId
		}).select('-_id -__v')

		if (populateUser) {
			query.populate({
				path: 'users',
				select: '-_id -__v',
				options: {
					limit: userLimit,
					skip: userSkip
				}
			})
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

function insertCompany({ companyId, companyFullName, companyLabelList, companyShortName, companySize, financeStage, positions = [], user }) {
	return new Promise((resolve, reject) => {
		if (!companyId) {
			reject(new Error('companyId must not be null or undefined'))
			return
		}

		Company.findOneAndUpdate(
			{
				companyId
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

async function insertCompanys(companys) {
	let len = companys.length
	let results = []

	if (!Array.isArray(companys)) {
		let res = await insertCompany(companys)
		return [res]
	}

	async function next(i) {
		if (i < len) {
			try {
				let res = await insertCompany(companys[i])
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

function pushUserToCompany(companyId, user) {
	return new Promise((resolve, reject) => {
		if (!companyId) {
			reject(new Error('companyId must not be null or undefined '))
			return
		}

		Company.findOneAndUpdate({ companyId }, { $push: { users: user } }, { new: true }, (err, doc) => {
			if (err) {
				reject(err)
			} else {
				resolve(doc)
			}
		})
	})
}

function pushPositionToCompany(companyId, position) {
	return new Promise((resolve, reject) => {
		if (!companyId) {
			reject(new Error('companyId must not be null or undefined '))
			return
		}

		Company.findOneAndUpdate({ companyId }, { $push: { positions: position } }, { new: true }, (err, doc) => {
			if (err) {
				reject(err)
			} else {
				resolve(doc)
			}
		})
	})
}

module.exports = {
    findByCompanyId,
    insertCompany,
    insertCompanys,
    pushUserToCompany,
    pushPositionToCompany
}