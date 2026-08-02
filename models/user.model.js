import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    _id : Number,
    name :{
        type : String,
        required : true,
        lowercase : true,
        trim :true,
    },
    email :{
        type : String,
        required : true,
        lowercase : true,
        trim : true,
        unique :true,
    },
    password :{
        type : String,
        required : true,
        minlength : 5,
        maxlength : 15,
        trim : true,
    },
    address :{
        type : String,
        required : true,
        lowercase :  true,
    },
    city :{
        type : String,
        required : true,
    },
    mobile :{
        type : String,
        required : true,
    },
    gender :{
        type : String,
        required :true,
    },
   
    role :{
        type : String,
       enum: ["student", "pending_instructor", "instructor", "admin"],
        default: "student"
    },
     verificationToken :{
        type: String
     },
    status:Number,
    info:String,
    profilePic: {
        type: String,
        default: ""
      },
},{
    timestamps:true
 } )

const userSchemaModel = mongoose.model("users_collections",userSchema);

export default userSchemaModel ;

