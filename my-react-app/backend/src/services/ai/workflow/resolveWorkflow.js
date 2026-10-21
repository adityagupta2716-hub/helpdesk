const ticketPreparationWorkflow = require("./workflows/ticketPreparationWorkflow.js");

function resolveWorkflow(context)
{
    if(!context?.sessionId)
    {
        return null;
    }

    return ticketPreparationWorkflow;
}

module.exports = {
    resolveWorkflow
};