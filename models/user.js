const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:true

    },
    email:{
        type:String,
        require:true,
        unquire: true
    },
    password:{
        type:String,
        require:true
    },
    age:{
        type:Number,
        require:true
    },

    gender:{
        type:String,
        enum:['Male', 'Female']
    },
    status:{
        type:String,
        enum:['Active','Suspended', 'Deleted', 'Inactive'],
        default:'Inactive'
    },
    posts:[{
        type:mongoose.SchemaTypes.ObjectId
    }],
    isVerified:{
        type: Boolean,
        default:false
    },
    otp:{
        type:String,
        default:null

    }
}, {
    timestamps:true
})

const userModel = mongoose.model('Users', userSchema)

module.exports = userModel