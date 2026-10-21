const {
    getDashboardMetrics
}=require("../../../../dashboard/DashboardService.js");
const ToolResult=require("../../../sdk/ToolResult.js");
async function getDashboardMetricsTool()
{
    const dashboard=await getDashboardMetrics();
    return ToolResult.success({
        summary:"Retrieved adminstrator dashboard metrics.",
        data:dashboard
    });
}

module.exports={
    getDashboardMetricsTool
};