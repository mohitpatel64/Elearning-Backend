import express from 'express';
import upload from "../config/multer.config.js";
import * as courseController from '../controller/course.controller.js';
import { save,fetch1 } from '../controller/progress.controller.js'
import * as lastVideoController from "../controller/lastvideo.controller.js";
import * as quizController from "../controller/quiz.controller.js";


const router = express.Router();


router.post("/save",upload.single("thumbnail"),courseController.save);
router.get("/fetch",courseController.fetchCourse);
router.patch("/update/:id", upload.single("thumbnail"),courseController.updateCourse);
router.delete("/delete/:id",courseController.deleteCourse);
router.post("/comments",courseController.coursecomments);
router.get("/getcomments",courseController.getcoursecomments);
router.get("/total-courses", courseController.totalCourses);


router.post("/add-module", courseController.addModule);
router.post("/add-video", upload.single("video"), courseController.addVideo);
router.post("/upload-pdf",upload.single("pdf"),courseController.uploadPdf);
router.post("/progress",save);
router.get("/prdata",fetch1)
router.post("/lastvideo", lastVideoController.saveLastVideo);
router.get("/lastvideo", lastVideoController.getLastVideo);
router.post("/quiz", quizController.saveQuiz);
router.get("/quiz", quizController.getQuiz);
router.get("/:id", courseController.getSingleCourse);
router.post("/delete-video", courseController.deleteVideo);
router.post("/delete-module", courseController.deleteModule);
router.post("/update-module", courseController.updateModule);
router.post("/update-video",upload.single("video"),courseController.updateVideo);
export default router;

