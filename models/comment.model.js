import mongoose from "mongoose";

const commentsSchema= new mongoose.Schema(

    {   
        courseId:String,
        courseName:String,
        studentId:String,
        studentName:String,
        instructorId:String,
        courseComment:String
    }

)

const commentsSchemaModel= mongoose.model("coursecomments",commentsSchema);

export default commentsSchemaModel;