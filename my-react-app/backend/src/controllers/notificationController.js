const Notification=require("../models/Notification.js");
const getNotifications=async(req,res)=>{
    try{
        const notifications=await Notification.find({
            user:req.user._id
        }).sort({createdAt:-1});
        res.status(200).json({
            count: notifications.length,
            notifications
        });
    }
    catch(error)
    {
        res.status(500).json({
            message:error.message
        });
    }
};
const markAsRead=async(req,res)=>{
    const notification=await Notification.findOne({
        _id:req.params.id,
        user:req.user._id
});
    if(!notification)
    {
        return res.status(404).json({
            message:"Notification not found"
        });
    }
    notification.isRead=true;
    await notification.save();
    res.status(200).json({
        message:"Notification marked as read"
    });
}
const markAllAsRead=async(req,res)=>{
    try{
        await Notification.updateMany(
            {
                user:req.user._id,
                isRead:false
            },
            {
                isRead:true
            }
        );
        res.status(200).json({
            message:"All notifications marked as read"
        });
    }
    catch(error)
    {
        res.status(500).json({
            message:error.message
        });
    }
};

module.exports={
    getNotifications,
    markAsRead,
    markAllAsRead
};