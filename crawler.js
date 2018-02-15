'use strict'
const { CrazyCrawler, Task } = require('crazy-crawler')
const qs = require('querystring')
const util = require('./util')

const models = require('./model')

const c = new CrazyCrawler({
	maxConnection: 5,
	maxTask: 0
})

c.on('begin', () => {
	console.log('crawler begins to work at ' + new Date())
})

c.on('progress', function({ index, all }) {
	console.log(`current progress: ${index}/${all}`)
})

c.on('finish', res => {
	console.log('crawler is finishing at ' + new Date())
})

const getDayBeforeBegin = days => {
	let d = new Date()
	d.setHours(0)
	d.setMinutes(0)
	d.setSeconds(0)
	d.setMilliseconds(0)
	let before = 0 - days * 24
	d.setHours(before)
	return d.getTime()
}

const saveDocs = async docs => {
	if (!Array.isArray(docs)) {
		docs = [docs]
	}

	let len = docs.length
	let results = []

	const next = async index => {
		if (index < len) {
			try {
				let doc = docs[index]
				let res = await doc.save()
				results.push(res)
			} catch (e) {
				results.push(e)
			}
			return next(index + 1)
		} else {
			return results
		}
	}

	return next(0)
}

const handleInsert = async (users, results) => {
	try {
		let userDocs = await models.userControler.insertUsers(users)
		let companyDocs = await models.companyControler.insertCompanys(results)
		let positionDocs = await models.positionControler.insertPositions(results)

		let userObject = {}
		userDocs.forEach(doc => {
			userObject[doc.userId] = doc
		})

		let companyObject = {}
		companyDocs.forEach(doc => {
			companyObject[doc.companyId] = doc
		})

		let positionObject = {}
		positionDocs.forEach(doc => {
			positionObject[doc.positionId] = doc
		})

		results.forEach(result => {
			let userId = result.publisherId
			let companyId = result.companyId
			let positionId = result.positionId

			userObject[userId].company = companyObject[companyId]
			userObject[userId].positions.addToSet(positionObject[positionId])

			companyObject[companyId].users.addToSet(userObject[userId])
			companyObject[companyId].positions.addToSet(positionObject[positionId])

			positionObject[positionId].user = userObject[userId]
			positionObject[positionId].company = companyObject[companyId]
		})

		await saveDocs(userDocs)
		await saveDocs(companyDocs)
		await saveDocs(positionDocs)
	} catch (error) {
		console.log('handleInsertError: ' + error.message)
	}
}

const handlePositions = async task => {
	let next = true
	try {
		let timeLimit = getDayBeforeBegin(10)
		let users = []
		let positionsAndCompanies = []
		let content = task.data.content
		content.positionResult.result.forEach((item, index) => {
			let createTime = new Date(item.createTime).getTime()
			let positionId = item.positionId

			if (createTime < timeLimit) {
				next = false
			} else {
				positionsAndCompanies.push(item)
				users.push(content.hrInfoMap[positionId])
			}
		})

		await handleInsert(users, positionsAndCompanies)
	} catch (error) {
		console.log('handlePositionError: ' + error.message)
	}
	return next
}

const handleNextTask = task => {
	try {
		task.params.page += 1
		let page = task.params.page
		task.axiosOptions.url =
			'https://www.lagou.com/jobs/positionAjax.json?px=new&needAddtionalResult=false&isSchoolJob=0&kd=' +
			task.params.keyword +
			'&pn=' +
			page
		task.fakeIP()
		task.cookies = null
		return task
	} catch (error) {
		return 'task Error: ' + error.message
	}
}

CrazyCrawler.defaultOptions.defaultHeaders['User-Agent'] =
	'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36'

const handler = function lagouPositionsCrawlerHandler() {
	return new Promise((resolve, reject) => {
		handlePositions(this)
			.then(next => {
				if (next) {
					resolve(handleNextTask(this))
				} else {
					resolve(decodeURI(this.params.keyword) + ' done')
				}
			})
			.catch(e => {
				reject(e)
			})
	})
}

function runCrawler(keywords, time) {
	c
		.functionalTask({
			name: 'lagouPositionsCrawl',
			baseUrl:
				'https://www.lagou.com/jobs/positionAjax.json?px=new&needAddtionalResult=false&isSchoolJob=0&kd=:keyword&pn=:page',
			method: 'POST',
			headers: {
				'User-Agent':
					'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36',
				Referer: 'https://www.lagou.com/jobs/list_nodejs?&fromSearch=true'
			},
			handler: handler,
			paramsConditions: {
				page: {
					setter: counter => 1,
					limit: counter => counter < keywords.length
				},
				keyword: {
					setter: counter => keywords[counter],
					limit: counter => counter < keywords.length
				}
			},
			fakeIP: true
		})
		.exec({ time })
}

module.exports = {
	runCrawler
}
