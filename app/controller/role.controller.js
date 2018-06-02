const Role = require('../model/role.model.js')

exports.create = (req, res) => {
    if(!req.body.name){
        return res.status(400).send({
            "message": "please, insert data correctly"
        })
    }

    const role = new Role({
        name : req.body.name
    })

    role.save().then(data => {
        res.send(data)
    }).catch( err => {
        res.status(500).send({
            "message" : err.message || "Some error occured while creating role"
        })
    })
}

exports.findAll = (req, res) => {
    Role.find().then(data => {
        res.send(data)
    }).catch(err => {
        res.status(500).send({
            "message" : err.message || "Some error occured while getting Role"
        })
    })
}

exports.findOne = (req, res) => {
    Role.findById(req.params.roleId)
    .then(data => {
        if(!data){
            return res.status(404).send({
                "message" : "no Role found with id " + req.params.roleId 
            })            
        }
        res.send(data)
    }).catch(err => {
        if(err.kind == "ObjectId"){
            return res.status(500).send({
                "message" : "no Role found with id " + req.params.roleId
            })
        }
        return res.status(500).send({
            "message" : "Error retrieving Role with id" + req.params.roleId
        })
    })
}

exports.update = (req, res) => {
    if(!req.body.name){
        return res.status(400).send({
            "message": "please, insert data correctly"
        })
    }

    Role.findByIdAndUpdate(req.params.roleId, {
        name : req.body.name
    }, {new: true})
    .then(data => {
        if(!data){
            return res.status(404).send({
                "message" : "no Role found with id " + req.params.roleId
            })
        }
        res.send(data)
    }).catch(err => {
        if(err.kind == "ObjectId"){
            return res.status(500).send({
                "message" : "no Role found with id " + req.params.roleId
            })
        }
        return res.status(500).send({
            "message" : "Error updating Role with id" + req.params.roleId
        })
    })
}

exports.delete = (req, res) => {
    Role.findByIdAndRemove(req.params.roleId)
    .then(data => {
        if(!data){
            return res.status(404).send({
                "message" : "no Role found with id " + req.params.roleId 
            })            
        }
        res.send({"message" : "Role deleted successfull"})
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                "message" : "no Role found with id " + req.params.roleId
            })
        }
        return res.status(500).send({
            "message" : "Error deleting Role with id" + req.params.roleId
        })
    })
}