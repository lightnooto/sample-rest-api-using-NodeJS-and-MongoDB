const Label = require('../model/label.model.js'),
    query = require('url')

exports.create = (req, res) => {
    if(!req.body.name){
        return res.status(400).send({
            "message": "please, insert data correctly"
        })
    }

    const label = new Label({
        name : req.body.name
    })

    label.save().then(data => {
        res.send(data)
    }).catch( err => {
        res.status(500).send({
            "message" : err.message || "Some error occured while creating label"
        })
    })
}

exports.findAll = (req, res) => {
    Label.find().then(data => {
        let result = {}
        result["result"] = data
        res.send(result)
    }).catch(err => {
        res.status(500).send({
            "message" : err.message || "Some error occured while getting label"
        })
    })
}

exports.search = (req, res) => {
    let Query =  query.parse(req.url, true).query
    if(Query.search == " ") {
        Label.find().then(data => {
            res.send(data)
        }).catch(err => {
            res.status(500).send({
                "message" : err.message || "Some error occured while getting label"
            })
        })
    }
    else{ 

        Label.find({name: new RegExp(Query.search, 'i') }).then(data => {
        if(data.length === 0){
            res.status(400).send({
                "message" : "no label"
            })
        }
        res.send(data)
        }).catch(err => {
            res.status(500).send({
                "message" : err.message || "Some error occured while getting label"
            })
        })
    }
}

exports.findOne = (req, res) => {
    Label.findById(req.params.labelId)
    .then(data => {
        if(!data){
            return res.status(404).send({
                "message" : "no label found with id " + req.params.labelId 
            })            
        }
        res.send(data)
    }).catch(err => {
        if(err.kind == "ObjectId"){
            return res.status(500).send({
                "message" : "no label found with id " + req.params.labelId
            })
        }
        return res.status(500).send({
            "message" : "Error retrieving label with id" + req.params.labelId
        })
    })
}

exports.update = (req, res) => {
    if(!req.body.name){
        return res.status(400).send({
            "message": "please, insert data correctly"
        })
    }

    Label.findByIdAndUpdate(req.params.labelId, {
        name : req.body.name
    }, {new: true})
    .then(data => {
        if(!data){
            return res.status(404).send({
                "message" : "no label found with id " + req.params.labelId
            })
        }
        res.send(data)
    }).catch(err => {
        if(err.kind == "ObjectId"){
            return res.status(500).send({
                "message" : "no label found with id " + req.params.labelId
            })
        }
        return res.status(500).send({
            "message" : "Error updating label with id" + req.params.labelId
        })
    })
}

exports.delete = (req, res) => {
    Label.find({ name : new RegExp(req.params.labelId, 'i') })
    .then(dataFind => {
        dataFind.forEach((dataAkhir, idx, array) => {
            Label.findByIdAndRemove(dataAkhir._id)
            .then(data => {
                if(!data){
                    return res.status(404).send({
                        "message" : "no label found with id " + dataAkhir._id
                    })            
                }
                if(idx == array.length - 1) {
                    res.send({"message" : "label deleted successfull"})
                }
                
            }).catch(err => {
                if(err.kind === 'ObjectId' || err.name === 'NotFound') {
                    return res.status(404).send({
                        "message" : "no label found with id " + dataAkhir._id
                    })
                }
                return res.status(500).send({
                    "message" : "Error deleting label with id " + dataAkhir._id
                })
            })
        })    
    }).catch(err => {
        return res.status(500).send({
            "message" : "Error finding label with name " + req.params.labelId
        })
    })
    
}