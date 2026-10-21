module.exports = {
    parameters: {
        type: "object",
        properties: {
            limit: {
                type: "number",
                description: "Maximum number of tickets to return."
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
                description: "Optional ticket status filter."
            },
            priority: {
                type: "string",
                enum: [
                    "Low",
                    "Medium",
                    "High"
                ],
                description: "Optional ticket priority filter."
            },
            department: {
                type: "string",
                description: "Optional department filter."
            },
            category: {
                type: "string",
                description: "Optional category filter."
            },
            sortBy: {
                type: "string",
                enum: ["createdAt", "priority", "status"],
                description: "Field to sort by."
            },
            sortOrder: {
                type: "string",
                enum: ["asc", "desc"],
                description: "Sort order (asc for oldest/pending longest, desc for newest)."
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
        type: "object",
        properties: {
            totalTickets: {
                type: "number"
            },
            returnedTickets: {
                type: "number"
            },
            tickets: {
                type: "array"
            }
        }
    }
};