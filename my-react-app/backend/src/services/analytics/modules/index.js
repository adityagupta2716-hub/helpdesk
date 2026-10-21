const {
    getStatusAnalytics
}=require("./statusAnalytics.js");

const {
    getDepartmentAnalytics
}=require("./departmentAnalytics.js");

const {
    getPriorityAnalytics
}=require("./priorityAnalytics.js");

const {
    getCategoryAnalytics
}=require("./categoryAnalytics.js");

const{
    getRecentTickets
}=require("./recentTickets.js");

const{
    getTicketOverview
}=require("./ticketOverview.js");

module.exports={
    overview:getTicketOverview,
    status:getStatusAnalytics,
    department:getDepartmentAnalytics,
    priority:getPriorityAnalytics,
    category:getCategoryAnalytics,
    recentTickets:getRecentTickets
};