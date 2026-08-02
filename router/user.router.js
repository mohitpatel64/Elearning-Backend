import express from "express";
import upload from "../config/multer.config.js";

const router = express.Router();

//to connect a controller on route
import * as userController from "../controller/user.controller.js";

router.post("/save",userController.save);
router.post("/login",userController.login);
router.get("/fetch",userController.fetch);
// router.patch("/update",userController.update);
router.patch("/update", upload.single("profilePic"), userController.update);
router.delete("/delete",userController.deleteUser);
router.get("/verify/:token",userController.verifyEmail);
router.get("/verify/:token",userController.verifyEmail);
router.patch("/approve-instructor/:id", userController.approveInstructor);

export default router;
