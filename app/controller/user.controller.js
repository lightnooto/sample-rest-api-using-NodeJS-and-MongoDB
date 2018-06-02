const User = require('../model/user.model.js'),
    Role = require('../model/role.model.js'),
    Bcrypt = require('bcryptjs'),
    session = require('express-session')

exports.create = (req, res, next) => {
    if(!req.body.firstname && !req.body.username && !req.body.role && !req.body.password){
        return res.status(400).send({
            "message": "please, insert data correctly"
        })
    }

    User.findOne({ username: req.body.username})
    .then(data => {
        if(data)
        {
            return res.status(400).send({
                "message": "username is unavailable"
            })
        }

        Role.findOne({ name : req.body.role})
        .then( dataRole => {
            if(!dataRole)
            {
                return res.status(400).send({
                    "message": "role is unavailable"
                })
            }
            let id = JSON.parse(JSON.stringify(dataRole))
            let roleName = id._id
            
            Bcrypt.hash(req.body.password , 8, function(errHash, hash) {
                if (errHash) {
                    console.log(errHash)
                    return next(errHash);
                }
                const user = new User({
                    firstname : req.body.firstname,
                    lastname : req.body.lastname || "",
                    username : req.body.username,
                    password : hash,
                    role : roleName
                })
        
                user.save().then(data => {
                    let dataSend = { id: data._id.to, username: data.username, role: req.body.role}
                    res.send(dataSend)
                }).catch( err => {
                    res.status(500).send({
                        "message" : err.message || "Some error occured while creating User"
                    })
                }) 
            })

        }).catch( err => {
            return res.status(500).send({
                "message": err.message || "error while retrieving role"
            })
        })
        
    }).catch(err => {
        res.status(500).send({
            "message" : err.message || "Some error occured while getting User"
        })
    })
}

exports.findAll = (req, res) => {
    if(req.session.user){console.log('a')}else{console.log('b')}
    User.find().then(data => {
        res.send(data)
    }).catch(err => {
        res.status(500).send({
            "message" : err.message || "Some error occured while getting User"
        })
    })
}

exports.findOne = (req, res) => {
    User.findById(req.params.userId)
    .then(data => {
        if(!data){
            return res.status(404).send({
                "message" : "no User found with id " + req.params.userId 
            })            
        }
        res.send(data)
    }).catch(err => {
        if(err.kind == "ObjectId"){
            return res.status(500).send({
                "message" : "no User found with id " + req.params.userId
            })
        }
        return res.status(500).send({
            "message" : "Error retrieving User with id" + req.params.userId
        })
    })
}

exports.update = (req, res) => {
    if(!req.body.firstname && !req.body.username && !req.body.role && !req.body.password){
        return res.status(400).send({
            "message": "please, insert data correctly"
        })
    }

    User.findOne({ username: req.body.username})
    .then(data => {
        if(data.length > 1)
        {
            return res.status(400).send({
                "message": "username is unavailable"
            })
        }

        Role.findOne({ name : req.body.role})
        .then( dataRole => {
            if(!dataRole)
            {
                return res.status(400).send({
                    "message": "role is unavailable"
                })
            }
            let id = JSON.parse(JSON.stringify(dataRole))
            let roleName = id._id
            
            Bcrypt.hash(req.body.password , 8, function(errHash, hash) {
                if (errHash) {
                    console.log(errHash)
                    return next(errHash);
                }

                User.findByIdAndUpdate(req.params.userId, {
                    firstname : req.body.firstname,
                            lastname : req.body.lastname || "",
                            username : req.body.username,
                            password : hash,
                            role : roleName
                }, {new: true})
                .then(data => {
                    if(!data){
                        return res.status(404).send({
                            "message" : "no User found with id " + req.params.userId
                        })
                    }
                    res.send(data)
                }).catch(err => {
                    if(err.kind == "ObjectId"){
                        return res.status(500).send({
                            "message" : "no User found with id " + req.params.userId
                        })
                    }
                    return res.status(500).send({
                        "message" : "Error updating User with id" + req.params.userId
                    })
                })
            })

        }).catch( err => {
            return res.status(500).send({
                "message": err.message || "error while retrieving role"
            })
        })

       

    }).catch(err => {
        res.status(500).send({
            "message" : err.message || "Some error occured while getting User"
        })
    })
}

exports.delete = (req, res) => {
    User.findByIdAndRemove(req.params.userId)
    .then(data => {
        if(!data){
            return res.status(404).send({
                "message" : "no User found with id " + req.params.userId 
            })            
        }
        res.send({"message" : "User deleted successfull"})
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                "message" : "no User found with id " + req.params.userId
            })
        }
        return res.status(500).send({
            "message" : "Error deleting User with id" + req.params.UserId
        })
    })
}

exports.login =  (req, res, next) => {
    if(!req.body.username && !req.body.password){
        return res.status(400).send({
            "message": "please, insert data correctly"
        })
    }
    User.findOne({ username: req.body.username })
    .then(data => {
        if(!data)
        {
            return res.status(400).send({
                "message" : "no User found  with username" + req.body.username
            })
        }

        Role.findById(data.role)
        .then(dataRole => {
            if(!dataRole)
            {
                return res.status(400).send({
                    "message" : "Role is nothing" 
                })
            }

            Bcrypt.compare(req.body.password, data.password, function (err, result) {
                if(result){
                    req.session.user = data
                    let dataUser = { username: data.username, role : dataRole.name, message : "Login successfully"}
                    return res.send(dataUser)
                }
                return res.status(500).send({
                    "message" : "Password was wrong" 
                })
            })
    
        }).catch(errRole => {
            return res.status(500).send({
                "message" : errRole.message ||  "Error finding role with name " + req.body.username
            })
        })
       
    }).catch(err => {
        return res.status(500).send({
            "message" : err.message ||  "Error finding username with name " + req.body.username
        })
    })
}