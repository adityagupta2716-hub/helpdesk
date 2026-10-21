const {
    runAnalytics
}=require("../../../../analytics");

const ToolResult=require("../../../sdk/ToolResult.js");

async function getAdminInsightsTool(
    filters={}
)
{
    const analytics=await runAnalytics({

        sections:[

            "overview",

            "status",

            "department",

            "priority",

            "category",

            "recentTickets"

        ],

        filters

    });

    return ToolResult.success({

        summary:"Administrator analytics generated successfully.",

        data:analytics

    });
}

module.exports={
    getAdminInsightsTool
};