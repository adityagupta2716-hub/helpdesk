const express=require("express");
const router=express.Router();
const {
    protect,
    authorize
}=require("../middleware/authMiddleware");
const {
    analyzeIntent
}=require("../services/intentAnalysisService.js");

const upload=require("../middleware/uploadMiddleware.js");

const {
    testAgent
}=require("../controllers/debugController.js");

router.post(
    "/agent",
    testAgent
);

router.get(
    "/me",
    protect,
    (req,res)=>{
        res.json({
            message:"Protected Route",
            user:req.user
        });
    }
);
router.get(
    "/admin",
    protect,
    authorize("admin"),
    (req,res)=>{
        res.json({
            message:"Welcome Admin"
        });
    }
);
router.get(
    "/student",
    protect,
    authorize("student"),
    (req,res)=>{
        res.json({
            message:"Welcome Student"
        });
    }
);
router.post(
    "/test-upload",
    upload.single("file"),
    async(req,res)=>{
        res.json({
            file:req.file
        });
    }
);
router.post("/test-ai",async(req,res)=>{
    try{
        const result=await analyzeIntent(
            req.body.message
        );
        res.json(result);
    }
    catch(error){
        res.status(500).json({
            message:error.message
        });
    }
});
module.exports=router;