import {configureStore} from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice.js";
import dashboardReducer from "../features/dashboard/dashboardSlice.js";
import ticketReducer from "../features/tickets/ticketSlice.js";
import notificationReducer from "../features/notifications/notificationSlice.js";
import userReducer from "../features/users/userSlice.js";
import departmentReducer from "../features/departments/departmentSlice.js";
import knowledgeBaseReducer from "../features/knowledgeBase/knowledgeBaseSlice.js";
import commentReducer from "../features/comments/commentSlice.js";
import timelineReducer from "../features/timeline/timelineSlice.js";
import attachmentReducer from "../features/attachments/attachmentSlice.js";
import chatbotReducer from "../features/chatbot/chatbotSlice.js";
export const store = configureStore({
    reducer:{
        auth:authReducer,
        dashboard:dashboardReducer,
        tickets:ticketReducer,
        notifications:notificationReducer,
        users:userReducer,
        departments:departmentReducer,
        knowledgeBase:knowledgeBaseReducer,
        comments:commentReducer,
        timeline:timelineReducer,
        attachments:attachmentReducer,
        chatbot:chatbotReducer
    }
});