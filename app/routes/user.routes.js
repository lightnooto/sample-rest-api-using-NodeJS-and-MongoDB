module.exports = (app) => {
    const user = require('../controller/user.controller.js'),
        session = require('express-session')

    app.post('/login', user.login)
    app.post('/user', user.create)
    app.get('/user', user.findAll)
    app.get('/user/:userId', user.findOne)
    app.put('/user/:userId', user.update)
    app.delete('/user/:userId', user.delete)

}