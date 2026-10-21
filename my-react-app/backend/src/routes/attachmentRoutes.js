const express=require("express");
const router=express.Router();
const{
    uploadAttachment,
    getTicketAttachments,
    deleteAttachment
}=require("../controllers/attachmentController.js");

const upload=require("../middleware/uploadMiddleware.js");
const{
    protect
}=require("../middleware/authMiddleware.js");

router.post(
    "/:ticketId",
    protect,
    upload.single("file"),
    uploadAttachment
);

router.get(
    "/:ticketId",
    protect,
    getTicketAttachments
);

router.delete(
    "/:attachmentId",
    protect,
    deleteAttachment
);

module.exports=router;