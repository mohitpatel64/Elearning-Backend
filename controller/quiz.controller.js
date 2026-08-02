import quizModel from "../models/quiz.model.js";


// Quiz Save
export const saveQuiz = async (req, res) => {

    try {

        await quizModel.create(req.body);

        res.status(201).json({
            message: "Quiz Saved Successfully"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: err.message
        });

    }

};


// Course ke saare quiz fetch
export const getQuiz = async (req, res) => {

    try {

        const result = await quizModel.find({
            courseId: req.query.courseId
        });

        res.status(200).json(result);

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: err.message
        });

    }

};