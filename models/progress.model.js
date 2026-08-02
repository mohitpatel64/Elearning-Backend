import mongoose from "mongoose";

const progressSchema= new mongoose.Schema(

    {   
        courseId:String,
        studentId:String,
        videoUrl:String,
        isComplete:Boolean
    }

)

const progressSchemaModel= mongoose.model("progress",progressSchema);

export default progressSchemaModel;