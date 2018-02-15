const expect = require('chai').expect
const models = require('../../model')
const data = require('../../model/mock.json')

const positionId = 2780825

models.connect().then(() => {
	describe('test position model', () => {
		describe('test add positions to db', () => {
			it('should contain 15 docs in res', done => {
				let positions = data.content.positionResult.result

				models.positionControler
					.insertPositions(positions)
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

		describe('test add user to a position', () => {
			it('should have property user', done => {
				let u = new models.User({
					userId: 2
				})
				models.positionControler
					.addUserToPosition(positionId, u)
					.then(res => {
						expect(res).to.have.property('user')
						return u.save()
					})
					.then(res => {
						done()
					})
					.catch(e => {
						done(e)
					})
			})
		})

		describe('test add company to a position', () => {
			it('should have property company', done => {
				let c = new models.Company({
					companyId: 2
				})
				
				models.positionControler
					.addCompanyToPosition(positionId, c)
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

		describe('test populate with user and company', () => {
            it('company should be an object with property companyId', done => {
				models.positionControler
					.findByPositionId(positionId, { populateCompany: true })
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
            
			it('user should be an object with property userId', done => {
				models.positionControler
					.findByPositionId(positionId, { populateUser: true })
					.then(res => {
						let user = res.user
						expect(user).to.be.an('object')
						expect(user).to.have.property('userId')
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
