const expect = require('chai').expect
const models = require('../../model')
const data = require('../../model/mock.json')

const userId = 8436606

models.connect().then(() => {
	describe('test user model', () => {
		describe('test add users to db', () => {
			it('should contain 15 docs in res', done => {
				let users = []
				let map = data.content.hrInfoMap
				Object.keys(map).forEach(key => {
					users.push(map[key])
				})

				models.userControler
					.insertUsers(users)
					.then(res => {
						expect(res)
							.to.be.an('array')
							.which.lengthOf(15)
						done()
					})
					.catch(e => {
						done(e)
					})
			})
		})

		describe('test add company to a user', () => {
			it('should have property company', done => {
				let c = new models.Company({
					companyId: 1
				})
				models.userControler
					.addCompanyToUser(userId, c)
					.then(res => {
						expect(res).to.have.property('company')
						return c.save()
					})
					.then(res => {
						done()
					})
					.catch(e => {
						done(e)
					})
			})
		})

		describe('test push positions to a user', () => {
			it('should have property positions and length is 3', done => {
				let p1 = new models.Position({
					positionId: 1
				})
				let p2 = new models.Position({
					positionId: 2
				})
				let p3 = new models.Position({
					positionId: 3
				})

				models.userControler
					.pushPositionToUser(userId, p1)
					.then(res => {
						return models.userControler.pushPositionToUser(userId, p2)
					})
					.then(res => {
						return models.userControler.pushPositionToUser(userId, p3)
					})
					.then(res => {
						let positions = res.positions
						expect(res).to.have.property('positions')
						expect(positions)
							.to.be.an('array')
							.which.lengthOf(3)

						return p1.save()
					})
					.then(res => {
						return p2.save()
					})
					.then(res => {
						return p3.save()
					})
					.then(res => {
						done()
					})
					.catch(e => {
						done(e)
					})
			})
		})

		describe('test populate with company and positions', () => {
			it('company should be an object with property companyId', done => {
				models.userControler
					.findByUserId(userId, { populateCompany: true })
					.then(res => {
						let company = res.company
						expect(company).to.be.an('object')
						expect(company).to.have.property('companyId')
						done()
					})
					.catch(e => {
						done(e)
					})
			})

			it('company should be an Array whose length is 2 and the first item is an object with property positionId which is 2', done => {
				models.userControler
					.findByUserId(userId, {
						populatePositions: true,
						positionLimit: 2,
						positionSkip: 1
					})
					.then(res => {
						let positions = res.positions

						expect(positions)
							.to.be.an('array')
							.that.lengthOf(2)
						expect(positions[0]).to.be.an('object')
						expect(positions[0]).to.have.property('positionId')
						expect(positions[0].positionId).to.be.equals(2)
						done()
					})
					.catch(e => {
						done(e)
						
					})
			})
		})
		
	})
	
	run()
})
