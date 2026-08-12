import express from 'express'
import * as contactController from '../controller/contact.controller.js'

const contactRouter=express.Router();

contactRouter.post("/save",contactController.save);
contactRouter.get("/fetch1",contactController.fetch1);

export default contactRouter;