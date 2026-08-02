import mongoose from "mongoose";

const lastVideoSchema = new mongoose.Schema({

    courseId: String,
    studentId: String,
    videoUrl: String

});

const lastVideoModel = mongoose.model("lastvideo", lastVideoSchema);

export default lastVideoModel;