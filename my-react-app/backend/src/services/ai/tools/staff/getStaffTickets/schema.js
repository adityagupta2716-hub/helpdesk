module.exports = {
    parameters: {
        type: "object",
        properties: {
            assignedToMeOnly: {
                type: "boolean",
                description: "If true, returns only tickets specifically assigned to this staff member. If false, includes department tickets."
            },
            status: {
                type: "string",
                enum: [
                    "Open",
                    "Assigned",
                    "In Progress",
                    "Resolved",
                    "Closed",
                    "Canceled"
                ],
                description: "Filter tickets by status."
            },
            priority: {
                type: "string",
                enum: [
                    "Low",
                    "Medium",
                    "High"
                ],
                description: "Filter tickets by priority."
            },
            sortBy: {
                type: "string",
                enum: ["createdAt", "priority", "status"],
                description: "Field to sort tickets by."
            },
            sortOrder: {
                type: "string",
                enum: ["asc", "desc"],
                description: "Sort direction (asc = oldest/pending longest first, desc = newest first)."
            },
            limit: {
                type: "number",
                description: "Maximum number of tickets to return (default 5)."
            },
            includeAll: {
                type: "boolean",
                description: "Whether all matching tickets should be returned."
            }
        },
        required: [],
        additionalProperties: false
    },
    returns: {
        type: "object"
    }
};
