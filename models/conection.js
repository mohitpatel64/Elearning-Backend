import mongoose  from 'mongoose';

const url = "mongodb://localhost:27017/elearning";

mongoose.connect(url);

console.log("data base connected successfully");
