import commentsSchemaModel from '../models/comment.model.js';
import '../models/conection.js';
import courseSchemaModel from '../models/course.model.js';

export let save = async (req, res) => {
    // console.log("save called");
    // console.log("BODY =>", req.body);
    // console.log("FILE =>", req.file);
    try {
        let courseList = await courseSchemaModel.find();
        //   console.log(courseList);
        let length = courseList.length;
         //   console.log(length);
        let _id = (length == 0) ? 1 : courseList[length - 1]._id + 1;
        // console.log(_id);

        let courseDetail = { ...req.body,"_id": _id };
        // console.log(courseDetail);

        if(req.file){
            courseDetail.thumbnail = req.file.filename;
        }
        await courseSchemaModel.create(courseDetail);
        res.status(200).json({ message: "Course save successfully" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}


// ----------------------------------------------------fetch Api------------------------------------------------

export let fetchCourse= async (req, res) => {
    console.log("fetching courses.");
    try {
        let condition_obj = req.query;
        // console.log(condition_obj);
        let courseDetail = await courseSchemaModel.find(condition_obj);
        // console.log(courseDetail);
        if(courseDetail.length>0){
            res.status(200).json({message:"Course fetched successfully",courseDetail:courseDetail});
        }
        else{
            res.status(400).json({message:"Course not found"});
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({message:"fetch failed",error:err.message});
    }
}


// ----------------------------------------------------update Api-------------------------------------------------------

export let updateCourse = async(req,res)=>{
    console.log("Updating course...");
    try{
        let course_id= req.params.id;
        // console.log(course_id);
        let update_obj = req.body;
        // console.log(update_obj);
        // image update
        if(req.file) {
            update_obj.thumbnail = req.file.filename;
        }
       
           let updated_course= await courseSchemaModel.updateOne({_id:course_id},{$set:update_obj})
           if(updated_course.modifiedCount>0){
            res.status(200).json({message:"Course updated successfully"});
           }
           else{
            res.status(400).json({message:"Course not updated"});
        }

        }
    catch(err){
        console.log(err);
        res.status(500).json({message:"updating failed",errror:err.message});
    }
}

// ---------------------------------------------------------------------delete Api---------------------------------------------------------------

export let deleteCourse = async(req,res)=>{
    try{
        let course_id = req.params.id;
        // console.log(course_obj);
     
       
            let deleted_obj = await courseSchemaModel.deleteOne({_id:course_id});
            if(deleted_obj.deletedCount>0){
                res.status(200).json({message:"Course deleted successfully",deleted_obj:deleted_obj});
            }
            else{
                res.status(400).json({message:"Course not found"});
            }
        }
   

    catch(err){
        console.log(err);
        res.status(500).json({message:"deleted failed"});

    }
}


// ---------------------------------------------------------------------GET SINGLE COURSE (ADD THIS)---------------------------------------------------------------

export const getSingleCourse = async (req, res) => {
  try {
    const course = await courseSchemaModel.findOne({ _id: req.params.id });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(course);

  } catch (err) {
   // console.log(err);
    res.status(500).json({ message: "Error fetching course" });
  }
};



 // ADD MODULE
 export const addModule = async (req, res) => {
 // console.log("Adding module...");
  try {
    const { courseId, title } = req.body;

    console.log("CourseId:", courseId);
   console.log("Title:", title);

    const course = await courseSchemaModel.findOne({ _id: courseId });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // agar syllabus nahi hai to init karo
    if (!course.syllabus) {
      course.syllabus = [];
    }

    course.syllabus.push({
      title,
      videos: []
    });

     console.log("After Push =", course.syllabus);

    await course.save();

    res.json({ message: "Module Added" });

  } catch (err) {
    console.log(err); //  error print karega
    res.status(500).json({ message: "Error adding module" });
  }
};


//add vedio
export const addVideo = async (req, res) => {
  try {
    const { courseId, title } = req.body;

    const moduleIndex = Number(req.body.moduleIndex);

    const course = await courseSchemaModel.findOne({ _id: courseId });

    //console.log("Module Index:", moduleIndex);
    //console.log("Syllabus:", course.syllabus);

    if (!course.syllabus[moduleIndex]) {
      return res.status(400).json({
        message: "Module not found"
      });
    }

    course.syllabus[moduleIndex].videos.push({
      title,
      url: req.file?.filename || ""
    });

    await course.save();

    res.json({ message: "Video Added" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error adding video" });
  }
};
//upload syllabus
export const uploadPdf = async (req, res) => {
  //console.log("Uploading PDF...");
  try {
    const { courseId } = req.body;
    console.log("Course ID:", courseId);
    await courseSchemaModel.updateOne(
      { _id: courseId },
      { syllabusPdf: req.file.filename }
    );

    res.json({ message: "PDF Uploaded" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error" });
  }
};

export const coursecomments = async (req, res) => {
 
  try {
    const coursecomments  = req.body;
    //console.log("Course com:", coursecomments);
    await commentsSchemaModel.create(coursecomments);
        res.json({ message: "Comment Submitted" });
    //console.log("com saved")
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error" });
  }
};

export const getcoursecomments = async (req, res) => {
 
  try {
    const coursecomments  = req.query;
    console.log("Course com:", coursecomments);
    let coursecomdata = await commentsSchemaModel.find(coursecomments);
        res.json(coursecomdata);
    console.log(coursecomdata)
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error" });
  }
};



// ========================================================Delete Video==========================================

export const deleteVideo = async (req, res) => {

    try {

        const { courseId, moduleIndex, videoIndex } = req.body;

        const course = await courseSchemaModel.findOne({
            _id: Number(courseId)
        });

        if (!course) {
            return res.status(404).json({
                message: "Course Not Found"
            });
        }

        course.syllabus[moduleIndex].videos.splice(videoIndex, 1);

        await course.save();

        res.json({
            message: "Video Deleted"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Delete Failed"
        });

    }

};



// ========================Delete Module======================================================================

export const deleteModule = async (req, res) => {

    try {

        const { courseId, moduleIndex } = req.body;

        const course = await courseSchemaModel.findOne({
            _id: Number(courseId)
        });

        if (!course) {
            return res.status(404).json({
                message: "Course Not Found"
            });
        }

        course.syllabus.splice(moduleIndex, 1);

        await course.save();

        res.json({
            message: "Module Deleted"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Delete Failed"
        });

    }

};



// =====================================Update Module Name===============================================

export const updateModule = async (req, res) => {

    try {

        const { courseId, moduleIndex, title } = req.body;

        const course = await courseSchemaModel.findOne({
            _id: Number(courseId)
        });

        if (!course) {
            return res.status(404).json({
                message: "Course Not Found"
            });
        }

        course.syllabus[moduleIndex].title = title;

        await course.save();

        res.json({
            message: "Module Updated"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Update Failed"
        });

    }

};





// =============================================Update Video================

export const updateVideo = async (req, res) => {

    try {

        const { courseId, moduleIndex, videoIndex, title } = req.body;

        const course = await courseSchemaModel.findOne({
            _id: Number(courseId)
        });

        if (!course) {
            return res.status(404).json({
                message: "Course Not Found"
            });
        }

        // Update Video Title
        course.syllabus[moduleIndex].videos[videoIndex].title = title;

        // Agar nayi video upload hui hai
        if (req.file) {
            course.syllabus[moduleIndex].videos[videoIndex].url =
                req.file.filename;
        }

        await course.save();

        res.json({
            message: "Video Updated"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Update Failed"
        });

    }

};