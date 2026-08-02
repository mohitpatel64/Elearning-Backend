import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({

    courseId: {
        type: String,
        required: true
    },

    question: {
        type: String,
        required: true
    },

    options: [
        {
            type: String,
            required: true
        }
    ],

    answer: {
        type: String,
        required: true
    }

});

const quizModel = mongoose.model("quiz", quizSchema);

export default quizModel;