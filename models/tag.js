const mongoose = require('mongoose');

const tagSchema = mongoose.Schema({
    nameTag: {
        type: String,
        required: true
    },
    images: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'image'
    }
})
const tag = mongoose.model('tag', tagSchema);
module.exports = tag;