const express= require("express");
const {SearchRES,SelectRES,InitRES,ConfirmRES,StatusRES,CancelRES} =require( "../../Controllers/ONDC_RES/index.js")
const OndcResRouter=express.Router();
OndcResRouter.post("/on_search",SearchRES);
OndcResRouter.post("/on_select",SelectRES);
OndcResRouter.post("/on_init",InitRES);
OndcResRouter.post("/on_confirm",ConfirmRES);
OndcResRouter.post("/on_status",StatusRES);
OndcResRouter.post("/on_cancel",CancelRES);


module.exports=OndcResRouter;