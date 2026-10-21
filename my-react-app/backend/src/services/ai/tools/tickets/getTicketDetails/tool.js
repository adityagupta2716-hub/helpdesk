const { createTool } = require("../../../sdk/createTool.js");
const schema = require("./schema.js");
const { getTicketDetailsService } = require("./service.js");

module.exports = createTool({
    name: "getTicketDetails",
    version: "1.0.0",
    category: "tickets",
    description: "Retrieves complete details, status, priority, resolution notes, and history of a specific ticket by its ID. Enforces role-based permissions.",
    enabled: true,
    permissions: {
        roles: ["student", "staff", "admin"],
        capabilities: {
            read: true,
            write: false,
            delete: false,
            externalNetwork: false,
            aiCallable: true
        }
    },
    parameters: schema.parameters,
    returns: schema.returns,
    execute: async (parameters, context) => {
        return await getTicketDetailsService(parameters, context);
    }
});
