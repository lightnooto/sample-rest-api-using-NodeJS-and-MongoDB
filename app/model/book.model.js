const mongoose = require('mongoose')
const BookSchema = mongoose.Schema({
    title: {
        type: String,
        trim: true,
        max: 70
    },
    description: {
        type: String,
        max: 1000
    },
    author: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    label: [{
        type: mongoose.Schema.Types.Mixed,
        ref: 'label'
    }],
    picture: {
        type : String,
        trim : true
    }
    
},{
    timestamps: true
})

module.exports = mongoose.model('book', BookSchema)