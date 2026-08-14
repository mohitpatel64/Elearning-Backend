import razorpay from "../config/razorpay.js";
import crypto from "crypto";
import EnrollmentModel from "../models/enrollment.model.js";

//Create Order
export const createOrder = async (req, res) => {
    console.log("Create Order Called ");
    try {
        const { amount } = req.body;
        //console.lg("Amount",amount);
        const options = {
            amount: amount * 100, //paisa
            currency: "INR",
            receipt: "receipt_" + Date.now()
        };
        // console.log("Options",options);
        const order = await razorpay.orders.create(options);
        // console.log("Order Created:", order);
        res.json(order);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ massage: "Error creating order" });
    }
};

// VERIFY PAYMENT + SAVE ENROLLMENT
export const verifyPayment = async (req, res) => {
    console.log("VerifyPayment Api Hit");
    console.log(req.body);

    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            userId,
            courseId,
            amount
        } = req.body;

        // DEMO MODE (MOST IMPORTANT)
        if (
            razorpay_payment_id === "demo_payment" ||
            razorpay_signature === "demo_signature"
        ) {
            const existing = await EnrollmentModel.findOne({
                userId,
                courseId
            });

            if (existing) {
                return res.json({ message: "Already Enrolled" });
            }
            await EnrollmentModel.create({
                userId,
                courseId,
                amount,
                paymentId: "demo_payment",
                orderId: razorpay_order_id || "demo_order",
                paymentStatus: "success"
            });

            return res.json({ message: "Demo Enrollment Success" });
        }

        //  REAL VERIFY
        const sign = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign)
            .digest("hex");

        if (expectedSign === razorpay_signature) {
            // Check if already enrolled
            const existing = await EnrollmentModel.findOne({
                userId,
                courseId
            });

            if (existing) {
                return res.json({
                    message: "Already Enrolled"
                });
            }

            await EnrollmentModel.create({
                userId,
                courseId,
                amount,
                paymentId: razorpay_payment_id,
                orderId: razorpay_order_id,
                paymentStatus: "success"
            });

            return res.json({ message: "Payment Verified" });
        }

        res.status(400).json({ message: "Invalid Signature" });

    } catch (err) {
        console.error("Verify Payment Error:", err);

        res.status(500).json({
            success: false,
            message: err.message,
            error: err
        });
    }
};

// GET MY ENROLLED COURSES
import CourseModel from "../models/course.model.js";

export const getMyCourses = async (req, res) => {
    try {
        const { userId } = req.query;

        const enrollments = await EnrollmentModel.find({ userId });

        //  manual join
        const courses = await Promise.all(
            enrollments.map(async (item) => {
                const course = await CourseModel.findOne({ _id: item.courseId });

                return {
                    ...item._doc,
                    courseId: course
                };
            })
        );

        res.json(courses);

    } catch (err) {
        res.status(500).json({ message: "Error fetching courses" });
    }
};





// ================================================================
import progressSchemaModel from "../models/progress.model.js";

export const instructorDashboard = async (req, res) => {

    try {

        const { courseId } = req.query;

        // Total Students
        const totalStudents = await EnrollmentModel.countDocuments({
            courseId: Number(courseId)
        });

        // Course Details
        const course = await CourseModel.findOne({
            _id: Number(courseId)
        });

        let totalVideos = 0;

        course.syllabus.forEach(module => {

            totalVideos += module.videos.length;

        });

        // All Enrolled Students
        const students = await EnrollmentModel.find({
            courseId: Number(courseId)
        });

       let totalPercentage = 0;

for (const student of students) {

    const completedVideos =
        await progressSchemaModel.countDocuments({

            courseId: String(courseId),

            studentId: String(student.userId),

            isComplete: true

        });

    let studentPercentage = 0;

    if (totalVideos > 0) {

        studentPercentage =
            (completedVideos / totalVideos) * 100;

    }

    totalPercentage += studentPercentage;

}

const completionRate =
    totalStudents === 0
        ? 0
        : Math.round(totalPercentage / totalStudents);

        res.json({

            totalStudents,

            completionRate

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            message: "Dashboard Error"

        });

    }

};




// ------------------------------------------------------
// Admin Dashboard - Total Enrollments
// ------------------------------------------------------

export const totalEnrollments = async (req, res) => {
    try {

        const totalEnrollments = await EnrollmentModel.countDocuments({
            paymentStatus: "success"
        });

        res.status(200).json({
            totalEnrollments
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Failed to get total enrollments"
        });

    }
};



// ------------------------------------------------------
// Admin Dashboard - Total Revenue
// ------------------------------------------------------

export const totalRevenue = async (req, res) => {
    try {

        const result = await EnrollmentModel.aggregate([
            {
                $match: {
                    paymentStatus: "success"
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: {
                        $sum: "$amount"
                    }
                }
            }
        ]);

        const totalRevenue =
            result.length > 0 ? result[0].totalRevenue : 0;

        res.status(200).json({
            totalRevenue
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Failed to get total revenue"
        });

    }
};