const express=require("express");
const router=express.Router();
const{
    protect,
    authorize
}=require("../middleware/authMiddleware");
const {
    getFAQs,
    createFAQ,
    updateFAQ,
    deleteFAQ
}=require("../controllers/knowledgeBaseController.js");
//const { create } = require("../models/Ticket");
router.get(
    "/",
    protect,
    getFAQs
)
router.post(
    "/",
    protect,
    authorize("admin"),
    createFAQ
)
router.put(
    "/:id",
    protect,
    authorize("admin"),
    updateFAQ
);
router.delete(
    "/:id",
    protect,
    authorize("admin"),
    deleteFAQ
);

module.exports=router;