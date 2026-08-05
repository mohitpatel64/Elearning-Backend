import '../models/conection.js';
import jwt from 'jsonwebtoken';
import rs from 'randomstring';
import userSchemaModel from '../models/user.model.js';
import sendMail from './email.controller.js';
import crypto from 'crypto';

// ---------------------------------------------------------save API------------------------------------------------------

export let save = async (req, res) => {
    try {
      // console.log("save called")
     let usersList = await userSchemaModel.find();
   //   console.log(usersList);
     let length = usersList.length;
   //   console.log(length);
   let _id=(length==0)?1:usersList[length-1]._id+1;
   // console.log(_id);

   let role = req.body.role;
   if(role=='instructor'){
      role="pending_instructor";
   }
   //genrate verification token
   const token = crypto.randomBytes(32).toString("hex");

      let userDetail = { ...req.body,role:role, _id: _id, status: 0,info: Date(),verificationToken:token };

        // console.log(userDetail);

       const user = await userSchemaModel.create(userDetail);

      //  verification link
      const verifyLink = `http://localhost:3001/user/verify/${token}`

      sendMail(user.email,verifyLink);

        res.status(200).json({ massage: "User saved successfully,Please verify your account" }); 
    } 
    catch (error) {
        console.log(error);
        res.status(500).json({ massage: "data not inserted", error: error.massage });
    }
}


// -----------------------------------------------------------Verify Email Api-----------------------------------------------------------------------

export const  verifyEmail = async(req,res)=>{
   // console.log("Verify api called");
   try{
      const user = await userSchemaModel.findOne({verificationToken:req.params.token})

      if(!user){
         return res.status(404).json({msg:"user not found"});
      }
      user.status = 1;
      user.verificationToken = "";
      await user.save();
      res.redirect("http://localhost:3000/login");
   }
   catch(err){
      console.log(err)
      res.status(500).json({msg:"Server Error"});
   }
}


//--------------------------Apprval Instructor-------------------
export const approveInstructor = async (req, res) => {
  try {
    const userId = req.params.id;

    // 1. check user exist
    const user = await userSchemaModel.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. validation
    if (user.role === "instructor") {
      return res.status(400).json({ message: "Already instructor" });
    }

    if (user.role !== "pending_instructor") {
      return res.status(400).json({ message: "Not eligible for approval" });
    }

    // 3. direct update
    await userSchemaModel.updateOne(
      { _id: userId },
      { 
        role: "instructor",
      }
    );

    res.status(200).json({
      message: "Instructor approved successfully"
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error approving instructor" });
  }
};
// --------------------------------------------------------login API------------------------------------------------------------------------------

export let login = async(req,res) => {
   // console.log("login called");
   try{
      let {email,password} = req.body;
      let user = await userSchemaModel.findOne({email});
      // console.log(user);
      if(!user){
         return res.status(400).json({massage:"invalid email"});
      }
      //check password
      if(user.password!=password){
         return res.status(400).json({massage:"invalid password"});
      }
      //check user status
      if(user.status==0){
         return res.status(400).json({massage:"wait for admin approval"});
      }

      const payload = {email:user.email};
      const key = rs.generate(16);
      const token = jwt.sign(payload,key);
      
      //success response
      res.status(200).json({user:user,token:token});
   }
   catch(err){
      console.log(err);
      res.status(500).json({massage:"login failed",err:err.massage})
   }
}

// ------------------------------------------------------fetch API--------------------------------------------------------------------------

export let fetch =async(req,res)=>{
   // console.log("fetch called");
   try{
      let condition_obj = req.query;
      // console.log(condition_obj);
      let userDetail = await userSchemaModel.find(condition_obj);
      // console.log(userDetail);
      if(userDetail.length>0){
         res.status(200).json({massage:"data fetched succesfully",user:userDetail})
      }
      else{
         res.status(200).json({massage:"data not found",user:[]})

      }
   }
   catch(err){
      console.log(err);
      res.status(500).json({massage:"fetch failed",error:err.massage})
   }
}

// ---------------------------------------------------------update API------------------------------------------------------

export let update = async(req,res)=>{
   try{
      // console.log("update called");
      let condition_obj = req.query;
      // console.log(condition_obj);
      let update_obj = req.body;
      // console.log(update_obj);
      if (req.file) {
         update_obj.profilePic = req.file.filename;
      }
      let userDetail = await userSchemaModel.find(condition_obj);
      // console.log(userDetail);
      if(userDetail.length>0){
         let updated_user = await userSchemaModel.updateMany(condition_obj,{$set:update_obj});
         // console.log(updatd_user);
         if(updated_user.modifiedCount>0){
            res.status(200).json({massage:"data updated successfully"});
         }
         else{
            res.status(400).json({massage:"data not updated"})

         }
      }
      else{
         res.status(400).json({massage:"data is not found"})
      }
   }
   catch(err){
      console.log(err)
      res.status(500).json({massage:"updated failed",error:err.massage});
      
   }
}

// ----------------------------------------------------delete API--------------------------------------------
export let deleteUser = async(req,res)=>{
   try{
      let condition_obj = req.query;
      // console.log(condition_obj);
      let userDetail = await userSchemaModel.find(condition_obj);
      // console.log(userDetail);
      if(userDetail.length>0){
         let deleted_user = await userSchemaModel.deleteMany(condition_obj);
         // console.log(deleted_user);
         if(deleted_user.deletedCount>0){
            res.status(200).json({massage:"data deleted successfully"});
         }
         else{
            res.status(400).json({massage:"data not deleted"})
         }
      }
      else{
         res.status(400).json({massage:"data not found"});
      }
   }
   catch(err){
      console.log(err);
      res.status(500).json({massage:"deleted failed",error:err.massage})

   }
}

