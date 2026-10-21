const express=require("express");
const cors=require("cors");
const app=express();
const authRoutes=require("./routes/authRoutes");
const testRoutes=require("./routes/testRoutes");
const ticketRoutes=require("./routes/ticketRoutes.js");
const dashboardRoutes=require("./routes/dashboardRoutes.js");
const userRoutes=require("./routes/userRoutes.js");
const notificationRoutes=require("./routes/notificationRoutes.js");
const departmentRoutes=require("./routes/departmentRoutes.js");
const knowledgeBaseRoutes=require("./routes/knowledgeBaseRoutes.js");
const commentRoutes=require("./routes/commentRoutes.js");
const attachmentRoutes=require("./routes/attachmentRoutes.js");
const chatbotRoutes=require("./routes/chatbotRoutes.js");
app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>{
    res.json({
        message:"AI Campus Helpdesk API Running"
    });
});
app.use(
    "/api/auth",
    authRoutes
);
app.use(
    "/api",
    testRoutes
);
app.use(
    "/api/tickets",
    ticketRoutes
);
app.use(
    "/api/dashboard",
    dashboardRoutes
);
app.use(
    "/api/users",
    userRoutes
);
app.use(
    "/api/notifications",
    notificationRoutes
);
app.use(
    "/api/departments",
    departmentRoutes
);
app.use(
    "/api/knowledge-base",
    knowledgeBaseRoutes
);
app.use(
    "/api/comments",
    commentRoutes
);
app.use(
    "/api/attachments",
    attachmentRoutes
);
app.use(
    "/api/chatbot",
    chatbotRoutes
);
module.exports=app;