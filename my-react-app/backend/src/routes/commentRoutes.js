const express=require("express");
const router=express.Router();
const{
    addComment,
    getComments,
    deleteComment
}=require("../controllers/commentController.js");
const{
    protect
}=require("../middleware/authMiddleware.js");

router.post(
    "/:ticketId",
    protect,
    addComment
);

router.get(
    "/:ticketId",
    protect,
    getComments
);

router.delete(
    "/:commentId",
    protect,
    deleteComment
);

module.exports=router;