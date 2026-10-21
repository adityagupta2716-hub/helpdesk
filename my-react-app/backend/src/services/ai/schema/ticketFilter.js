const dateFilter = require("./dateFilter");

module.exports = {
    type: "object",

    properties: {

        dateFilter: dateFilter,

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
            description: "Filter by ticket status."
        },

        priority: {
            type: "string",
            enum: [
                "Low",
                "Medium",
                "High",
                "Critical"
            ],
            description: "Filter by ticket priority."
        },

        department: {
            type: "string",
            description: "Filter by department."
        },

        category: {
            type: "string",
            description: "Filter by category."
        },

        createdBy: {
            type: "string",
            description: "Filter by creator user id."
        },

        assignedTo: {
            type: "string",
            description: "Filter by assigned staff id."
        },

        search: {
            type: "string",
            description: "Free-text search across ticket title and description."
        },

        includeAll: {
            type: "boolean",
            default: false
        },

        limit: {
            type: "number",
            default: 5
        },

        sortBy: {
            type: "string",
            enum: [
                "createdAt",
                "updatedAt",
                "priority",
                "status"
            ],
            default: "createdAt"
        },

        sortOrder: {
            type: "string",
            enum: [
                "asc",
                "desc"
            ],
            default: "desc"
        }

    },

    required: [],

    additionalProperties: false
};