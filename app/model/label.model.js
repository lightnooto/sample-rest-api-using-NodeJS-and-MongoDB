const mongoose = require('mongoose')
const LabelSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        max: 50
    }
},{
    timestamps: true
})

module.exports = mongoose.model('label', LabelSchema)