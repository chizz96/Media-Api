const mongoose = require('mongoose')


const post = new mongoose.Schema ({
     userId:{
        // type:mongoose.Schema.Types.ObjectId
        type:mongoose.SchemaTypes.ObjectId,
        ref:'Users',
        require:true
       
    },
    content:{
        type:String,
        requieed: true
    },

    media:[{
        imageUrl:{
            type:String,required:true
        },
        imageId:{
            type:String, required:true
        }

    }]

},{
    timestamps:true
});





const postModel = mongoose.Model('Posts', postSchema)

module.exports = postModel