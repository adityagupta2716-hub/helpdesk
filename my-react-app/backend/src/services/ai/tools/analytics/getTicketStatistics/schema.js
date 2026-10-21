module.exports = {
    parameters: {
        type: "object",
        properties: {
            timeframe: {
                type: "string",
                enum: ["all", "today", "this_week", "this_month"],
                description: "Optional time period filter for statistics (e.g. this_week, today)."
            },
            department: {
                type: "string",
                description: "Optional department filter."
            },
            category: {
                type: "string",
                description: "Optional category filter."
            },
            priority: {
                type: "string",
                enum: ["Low", "Medium", "High"],
                description: "Optional priority filter."
            }
        },
        required: [],
        additionalProperties: false
    },
    returns: {
        type: "object"
    }
};
