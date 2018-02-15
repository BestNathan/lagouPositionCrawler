const { runCrawler } = require('./crawler')
const models = require('./model')

const keywordsToCrawl = ['nodejs', '前端']

models
	.connect()
	.then(() => {
		let keyword = keywordsToCrawl.map(keyword => encodeURIComponent(keyword))
		runCrawler(keyword, '0 1 0 * * *')
	})
	.catch(e => {
		console.log(e)
	})
