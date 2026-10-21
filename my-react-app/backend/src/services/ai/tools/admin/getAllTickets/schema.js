const dateFilterSchema = require("../../../schema/dateFilter.js");

module.exports = {
    parameters: {
        type: "object",
        properties: {
            limit: {
                type: "number",
                description: "Maximum number of tickets to return."
            },
            includeAll: {
                type: "boolean",
                description: "Return every matching ticket."
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
            department: {
                type: "string",
                description: "Filter tickets by department."
            },
            category: {
                type: "string",
                description: "Filter tickets by category."
            },
            sortBy: {
                type: "string",
                enum: ["createdAt", "priority", "status", "updatedAt"],
                description: "Field to sort by (default: createdAt)."
            },
            sortOrder: {
                type: "string",
                enum: ["asc", "desc"],
                description: "Sort order (asc for oldest/pending longest, desc for newest)."
            },
            dateFilter: dateFilterSchema
        },
        required: [],
        additionalProperties: false
    },
    returns: {
        type: "object"
    }
};
