const { createTool } = require("../../../sdk/createTool.js");
const schema = require("./schema.js");
const { getTicketStatisticsService } = require("./service.js");

module.exports = createTool({
    name: "getTicketStatistics",
    version: "1.0.0",
    category: "analytics",
    description: "Returns verified ticket counts, status distributions, priority breakdown, category frequencies, and time-based metrics using real-time MongoDB aggregations. Scoped to the user's role.",
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
        return await getTicketStatisticsService(parameters, context);
    }
});
