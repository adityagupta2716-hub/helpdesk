const express=require("express");
const router=express.Router();
const{
    protect,
    authorize
}=require("../middleware/authMiddleware");
const{
    getStudentDashboard,
    getStaffDashboard,
    getAdminDashboard
}=require("../controllers/dashboardController");

router.get(
    "/student",
    protect,
    authorize("student"),
    getStudentDashboard
);
router.get(
    "/staff",
    protect,
    authorize("staff"),
    getStaffDashboard
);
router.get(
    "/admin",
    protect,
    authorize("admin"),
    getAdminDashboard
);
module.exports=router;