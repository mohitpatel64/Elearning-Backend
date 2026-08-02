import mongoose from "mongoose";
import progressSchemaModel from "../models/progress.model.js";
import '../models/conection.js'

export const save = async (req, res) => {
    try {

        const exist = await progressSchemaModel.findOne({
            courseId: req.body.courseId,
            studentId: req.body.studentId,
            videoUrl: req.body.videoUrl
        });

        if (!exist) {

            await progressSchemaModel.create(req.body);

        }

        res.status(200).json({
            message: "Progress Saved"
        });

    }
    catch (err) {

        console.log(err);

        res.status(500).json({
            message: err.message
        });

    }
}

export const fetch1=async(req,res)=>{
    try{
        
        //console.log(req.query);
    const result= await progressSchemaModel.find(req.query);
    //console.log(result);
    res.status(200).json(result)
    }
    catch(e){
        console.log(e)
        res.status(502).json({"m":"a"})
        }
}