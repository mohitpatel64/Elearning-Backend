import express from 'express';
import { createOrder, verifyPayment,getMyCourses,instructorDashboard,totalEnrollments ,totalRevenue} from "../controller/enrollment.controller.js";


const router = express.Router();

router.post("/create-order",createOrder);
router.post("/verify-payment",verifyPayment);
router.get("/mycourses",getMyCourses);
router.get("/instructor", instructorDashboard);

router.get("/total-enrollments", totalEnrollments);
router.get("/total-revenue", totalRevenue);
export default router;