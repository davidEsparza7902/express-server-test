const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
    content: {
        minLength: 5,
        required: true,
        type: String
    },
    important: Boolean,
})

noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    },
})

module.exports = mongoose.model('Note', noteSchema)
