import express from 'express';
import { createOrder, verifyPayment,getMyCourses,instructorDashboard } from "../controller/enrollment.controller.js";


const router = express.Router();

router.post("/create-order",createOrder);
router.post("/verify-payment",verifyPayment);
router.get("/mycourses",getMyCourses);
router.get("/instructor", instructorDashboard);

export default router;