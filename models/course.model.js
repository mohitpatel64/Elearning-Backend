import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
    _id : Number,
    title :{
        type : String,
        required : true,
        trim :true,
    },
    price :{
        type : Number,
        required : true,
    },
    duration :{
        type : String,
        required : true,
    },

    description :{
        type : String,
        required : true,
        trim:true,
    },
       thumbnail:{
        type:String,
        default :""
    },
    instructorid:{
        type:Number,
        required:true,
    },
    courseStatus :{
        type:String,
        enum:["pending","approved","rejected"],
        default:"pending"
    },
    syllabus: [
        {
          title: String,
          videos: [
            {
              title: String,
              url: String
            }
          ]
        }
      ],
      syllabusPdf: String
   },
   {
    timestamps:true
   }

)


const courseSchemaModel = mongoose.model("course_collection",courseSchema);

export default courseSchemaModel ;