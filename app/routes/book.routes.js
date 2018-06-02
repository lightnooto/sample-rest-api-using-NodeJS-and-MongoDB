
module.exports = (app) => {
    const book = require('../controller/book.controller.js'),
    multer = require('multer'),
    upload = multer({ dest: 'uploads/'})
    
    app.post('/book', upload.single('picture'), book.create)
    app.get('/book', book.findAll)
    app.get('/book/:bookId', book.findOne)
    app.get('/book/img/:bookId', book.img)
    app.put('/book/:bookId', upload.single('picture'), book.update)
    app.delete('/book/:bookId', book.delete)
}