const expect = require('chai').expect
const models = require('../../model')
const data = require('../../model/mock.json')

const companyId = 173605

models.connect().then(() => {
	describe('test company model', () => {
		describe('test add companys to db', () => {
			it('should contain 15 docs in res', done => {
				let companys = data.content.positionResult.result

				models.companyControler
					.insertCompanys(companys)
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

		describe('test push user to a company', () => {
			it('should have property users and length is 2', done => {
				let u1 = new models.User({
					userId: 1
				})
				let u2 = new models.User({
					userId: 3
				})
				models.companyControler
					.pushUserToCompany(companyId, u1)
					.then(res => {
						return models.companyControler.pushUserToCompany(companyId, u2)
					})
					.then(res => {
						expect(res)
							.to.have.property('users')
							.which.lengthOf(2)
						return u1.save()
					})
					.then(res => {
						return u2.save()
					})
					.then(res => {
						done()
					})
					.catch(e => {
						done(e)
					})
			})
		})

		describe('test push positions to a company', () => {
			it('should have property positions and length is 3', done => {
				let p1 = new models.Position({
					positionId: 4
				})
				let p2 = new models.Position({
					positionId: 5
				})
				let p3 = new models.Position({
					positionId: 6
				})

				models.companyControler
					.pushPositionToCompany(companyId, p1)
					.then(res => {
						return models.companyControler.pushPositionToCompany(companyId, p2)
					})
					.then(res => {
						return models.companyControler.pushPositionToCompany(companyId, p3)
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

		describe('test populate with user and positions', () => {
			it('user should be an object with property userId', done => {
				models.companyControler
					.findByCompanyId(companyId, { populateUser: true, userLimit: 1, userSkip: 1 })
					.then(res => {
						let users = res.users
						expect(users)
							.to.be.an('array')
							.that.lengthOf(1)
						expect(users[0]).to.be.an('object')
						expect(users[0]).to.have.property('userId')
						expect(users[0].userId).to.be.equals(3)
						done()
					})
					.catch(e => {
						done(e)
					})
			})

			it('positions should be an Array whose length is 2 and the first item is an object with property positionId which is 5', done => {
				models.companyControler
					.findByCompanyId(companyId, {
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
						expect(positions[0].positionId).to.be.equals(5)
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
