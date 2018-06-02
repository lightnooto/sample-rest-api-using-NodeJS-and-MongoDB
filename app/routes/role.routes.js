module.exports = (app) => {
    const role = require('../controller/role.controller.js')
    
    app.post('/role', role.create)
    app.get('/role', role.findAll)
    app.get('/role/:roleId', role.findOne)
    app.put('/role/:roleId', role.update)
    app.delete('/role/:roleId', role.delete)
}