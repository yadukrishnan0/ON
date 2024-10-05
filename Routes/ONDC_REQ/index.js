const express= require("express");
const {SearchREQ,SelectReq,InitReq,ONDCInitReq, OndcSelectReq,OndcConfirmReq,CancelReq} =require('../../Controllers/ONDC_REQ/index.js')
const {GETSearchREQ} =require('../../Controllers/GET_REQ/index.js')

const OndcReqRouter=express.Router();
OndcReqRouter.post("/search",SearchREQ)
OndcReqRouter.post("/select",SelectReq)
OndcReqRouter.post("/init",InitReq)
OndcReqRouter.post("/ondcselect",OndcSelectReq)
OndcReqRouter.post("/ondcinit",ONDCInitReq)
OndcReqRouter.post("/ondcconfirm",OndcConfirmReq);
OndcReqRouter.post("/cancel",CancelReq)
OndcReqRouter.get("/search",GETSearchREQ)
module.exports= OndcReqRouter;