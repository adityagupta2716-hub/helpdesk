module.exports = {
    parameters: {
        type: "object",
        properties: {
            ticketId: {
                type: "string",
                description: "The MongoDB ObjectId or identifier of the ticket to retrieve."
            }
        },
        required: ["ticketId"],
        additionalProperties: false
    },
    returns: {
        type: "object"
    }
};
