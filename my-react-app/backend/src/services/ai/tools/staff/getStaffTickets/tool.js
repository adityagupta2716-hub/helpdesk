const { createTool } = require("../../../sdk/createTool.js");
const schema = require("./schema.js");
const { getStaffTicketsService } = require("./service.js");

module.exports = createTool({
    name: "getStaffTickets",
    version: "1.0.0",
    category: "staff",
    description: "Returns tickets assigned to the logged-in staff member or tickets belonging to the staff member's department. Supports filtering by status, priority, and date.",
    enabled: true,
    permissions: {
        roles: ["staff"],
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
        return await getStaffTicketsService(parameters, context);
    }
});
