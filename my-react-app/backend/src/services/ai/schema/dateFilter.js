module.exports = {
    type: "object",

    properties: {

        field: {
            type: "string",
            enum: [
                "createdAt",
                "updatedAt",
                "assignedAt",
                "resolvedAt",
                "closedAt"
            ],
            default: "createdAt",
            description: "The ticket date field to filter on."
        },

        operator: {
            type: "string",
            enum: [
                "today",
                "yesterday",
                "this_week",
                "last_week",
                "this_month",
                "last_month",

                "relative",

                "before",
                "after",

                "between",

                "exact"
            ],
            description: "Date filtering strategy."
        },

        unit: {
            type: "string",
            enum: [
                "day",
                "week",
                "month",
                "year"
            ],
            description: "Used only with relative filters."
        },

        value: {
            type: "number",
            description: "Relative amount. Example: last 30 days = 30."
        },

        date: {
            type: "string",
            description: "ISO date. Used for before, after and exact."
        },

        from: {
            type: "string",
            description: "Range start (ISO date)."
        },

        to: {
            type: "string",
            description: "Range end (ISO date)."
        }

    },

    required: [
        "operator"
    ],

    additionalProperties: false
};