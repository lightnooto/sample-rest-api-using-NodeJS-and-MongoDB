module.exports = (app) => {
    const label = require('../controller/label.controller.js')
    
    app.post('/label', label.create)
    app.get('/label', label.findAll)
    app.get('/label/:labelId', label.findOne)
    app.get('/findLabel', label.search)
    app.put('/label/:labelId', label.update)
    app.delete('/label/:labelId', label.delete)
}