const models = require('../model')

after(done => {
    models.disconnect().then(res =>{
        done()
        process.exit(0)
    })
})