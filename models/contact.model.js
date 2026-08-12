import mongo from 'mongoose';

const contactSc=new mongo.Schema({
    
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    subject:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    }

},
{timestamps:true}
)

const contactModel= mongo.model("contactData",contactSc);

export default contactModel;
