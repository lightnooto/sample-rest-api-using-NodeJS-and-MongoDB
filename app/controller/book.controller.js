const Book = require('../model/book.model.js'),
    User = require('../model/user.model.js'),
    label = require('../model/label.model.js'),
    path = require('path')

exports.create = (req, res, next) => {
    if(!req.body.description && !req.body.author && !req.file.filename){
        return res.status(400).send({
            "message": "please, insert data correctly"
        })
    }

    // let authorId=0;
    // for(let i=0; i<req.body.author.length; i++)
    // {
    //     User.findById(req.body.author[i]._id)
    //     .then(dataUser =>{
    //         if(!dataUser) 
    //         {authorId= JSON.stringify(req.body.author[i]._id)
    //         console.log(authorId)}
    //     })
    // }

    // if(!authorId)
    // {
    //     return res.status(400).send({
    //         "message": "author is unavailable with id " + authorId
    //     })
    // }

    const book = new Book({
        title : req.body.title || "Untitled",
        description : req.body.description,
        author : req.body.author,
        label : req.body.label,
        picture : req.file.filename
    })
    
    book.save().then(data => {
        return res.send(data)
    }).catch( err => {
         return res.status(500).send({
            "message" : err.message || "Some error occured while creating book"
        })
    })
}



exports.findAll = (req, res) => {
    Book.find().then(data => {
        res.send(data)
    }).catch(err => {
        res.status(500).send({
            "message" : err.message || "Some error occured while getting book"
        })
    })
}

exports.findOne = (req, res) => {
    Book.findById(req.params.bookId)
    .then(data => {
        if(!data){
            return res.status(404).send({
                "message" : "no book found with id " + req.params.bookId 
            })            
        }
        res.send(data)
    }).catch(err => {
        if(err.kind == "ObjectId"){
            return res.status(500).send({
                "message" : "no book found with id " + req.params.bookId
            })
        }
        return res.status(500).send({
            "message" : "Error retrieving book with id" + req.params.bookId
        })
    })
}

exports.update = (req, res) => {
    if(!req.body.description && !req.body.author){
        return res.status(400).send({
            "message": "please, insert data correctly"
        })
    }
    let book = {
        title : req.body.title || "Untitled",
        description : req.body.description,
        author : req.body.author,
        label : req.body.label,
    }
    if(req.file) {
        book = {
            title : req.body.title || "Untitled",
            description : req.body.description,
            author : req.body.author,
            label : req.body.label,
            picture : req.file.filename
        }
    }
    Book.findByIdAndUpdate(req.params.bookId, book, {new: true})
    .then(data => {
        if(!data){
            return res.status(404).send({
                "message" : "no book found with id " + req.params.bookId
            })
        }
        res.send(data)
    }).catch(err => {
        if(err.kind == "ObjectId"){
            return res.status(500).send({
                "message" : "no book found with id " + req.params.bookId
            })
        }
        return res.status(500).send({
            "message" : "Error updating book with id" + req.params.bookId
        })
    })
}

exports.delete = (req, res) => {
    Book.findByIdAndRemove(req.params.bookId)
    .then(data => {
        if(!data){
            return res.status(404).send({
                "message" : "no book found with id " + req.params.bookId 
            })            
        }
        res.send({"message" : "book deleted successfull"})
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                "message" : "no book found with id " + req.params.bookId
            })
        }
        return res.status(500).send({
            "message" : "Error deleting book with id" + req.params.bookId
        })
    })
}

exports.img = (req, res) =>{
    Book.findById(req.params.bookId)
    .then(data => {
        if(data)
            return res.sendFile(path.join(__dirname , '../../uploads/'+ data.picture))
        else
            return res.status(404).send({
                "message" : "no image found with id " + req.params.bookId
            })
    }).catch(err => {
        return res.status(500).send({
            "message" : "Error getting image with id " + req.params.bookId
        })
    })
    
}