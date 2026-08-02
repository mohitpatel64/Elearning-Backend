import lastVideoModel from "../models/lastvideo.model.js";

export const saveLastVideo = async (req, res) => {

    try {

        const exist = await lastVideoModel.findOne({

            courseId: req.body.courseId,
            studentId: req.body.studentId

        });

        if (exist) {

            exist.videoUrl = req.body.videoUrl;

            await exist.save();

        }
        else {

            await lastVideoModel.create(req.body);

        }

        res.status(200).json({
            message: "Last Video Saved"
        });

    }
    catch (err) {

        console.log(err);

        res.status(500).json(err);

    }

}


export const getLastVideo = async (req, res) => {

    try {

        const result = await lastVideoModel.findOne(req.query);

        res.status(200).json(result);

    }
    catch (err) {

        console.log(err);

        res.status(500).json(err);

    }

}