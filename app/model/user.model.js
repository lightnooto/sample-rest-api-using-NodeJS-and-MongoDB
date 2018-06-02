const mongoose = require('mongoose')
const UserSchema = mongoose.Schema({
    firstname:{
        required: true,
        type: String,
        trim: true,
        max: 70
    },
    lastname:{
        type: String,
        trim: true,
        max: 70
    },
    username: {
        required: true,
        type: String,
        trim: true,
        max: 70
    },
    password: {
        required: true,
        type: String
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'role'
    },
},{
    timestamps: true
})

module.exports = mongoose.model('user', UserSchema)