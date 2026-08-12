import contactModel from "../models/contact.model.js";

export const save=async (req,res)=>{
    try{
        console.log("contact controller");
    const contactFormData=req.body;
    // console.log(contactFormData);
    const result=await contactModel.create({...contactFormData});
    //console.log(result);
    res.status(200).json({"msg":"contact saved"})
    }
    catch(e){res.status(500).json({"msg":''})}
}


export const fetch1=async (req,res)=>{
    try{
    console.log("fetch");
    const result=await contactModel.find();
    console.log(result);
    res.status(200).json(result)
    }
    catch(e){res.status(500).json({"msg":''})}
}