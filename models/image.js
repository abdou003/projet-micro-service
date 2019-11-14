const mongoose = require('mongoose');

const imageSchema = mongoose.Schema({
    nameImage: {
        type: String,
        
    },
    hdbId: {
        type: Number,
        unique : true
    }
})




imageSchema.pre('remove',{ document: true}, function(next) {
    var image = this;
    image.model('tag').updateMany({},{
        $pull: {  images : image._id  }
    }).then(res=>{
        console.log(res)
    }).catch(err=>console.log(err));
   
console.log('pre delete')
next();
});

const image = mongoose.model('image', imageSchema);

module.exports = image;