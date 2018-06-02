const mongoose = require('mongoose')
const RoleSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        max: 70
    },
})

module.exports = mongoose.model('role', RoleSchema)