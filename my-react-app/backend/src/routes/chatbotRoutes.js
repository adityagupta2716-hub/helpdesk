const express=require("express");
const router=express.Router();
const {
    protect
}=require("../middleware/authMiddleware.js");
const {
    askChatbot,
    getSessions,
    getMessages,
    updateSessionTitle,
    removeSession
}=require("../controllers/chatbotController.js");

const{
    askChatAgent
}=require("../controllers/chatAgentController.js");

router.post(
    "/",
    protect,
    askChatAgent
);

router.get(
    "/sessions",
    protect,
    getSessions
);

router.get(
    "/sessions/:id/messages",
    protect,
    getMessages
);

router.put(
    "/sessions/:id",
    protect,
    updateSessionTitle
);

router.delete(
    "/sessions/:id",
    protect,
    removeSession
);

module.exports=router;