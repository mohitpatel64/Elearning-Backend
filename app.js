import dotenv from 'dotenv';
import path from "path";

// LOAD ENV
/*
dotenv.config()
*/

dotenv.config({
    path:path.resolve("./.env")
});

import { connectDB } from "./models/conection.js";
await connectDB();

import express from 'express';
import cors from 'cors';

const app=express();

//to allow cross origin request
app.use(cors());

//to link router file to app.js
import userRouter from "./router/user.router.js";
import courseRouter from './router/course.router.js';
import enrollmentRouter from './router/enrollment.router.js';
import contactRouter from './router/contact.router.js';



//to parse json data from request body
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/assets/uploads", express.static("assets/uploads"));

//APPLICATION MIDDKEWARE CKECK base url
app.use("/user",userRouter);
app.use("/course",courseRouter);
app.use("/enrollment",enrollmentRouter);
app.use("/contact",contactRouter)
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
