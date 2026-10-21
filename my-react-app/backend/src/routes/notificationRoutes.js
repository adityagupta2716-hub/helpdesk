const express=require("express");
const router=express.Router();
const{
    getNotifications,
    markAsRead,
    markAllAsRead
}=require("../controllers/notificationController.js");
const{
    protect
}=require("../middleware/authMiddleware.js");
router.get(
    "/",
    protect,
    getNotifications
);
router.put(
    "/:id/read",
    protect,
    markAsRead
)
router.put(
    "/read-all",
    protect,
    markAllAsRead
);
module.exports=router;