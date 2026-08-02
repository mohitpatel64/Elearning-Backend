import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema({
  userId: Number,

  /*courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "course"
  }*/
    courseId:Number,

  amount: Number,
  paymentId: String,
  orderId: String,
  paymentStatus: {
    type: String,
    default: "pending"
  }
}, { timestamps: true });

const EnrollmentModel = mongoose.model("enrollment", enrollmentSchema);

export default EnrollmentModel;