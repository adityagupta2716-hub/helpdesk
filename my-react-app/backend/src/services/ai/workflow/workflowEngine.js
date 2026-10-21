const WorkflowResult=require("./workflowResult");

const {
    resolveWorkflow
}=require("./resolveWorkflow");

class WorkflowEngine
{
    async execute({
        message,
        history=[],
        context
    })
    {
        const workflow=resolveWorkflow(context);
        if(!workflow)
        {
            return WorkflowResult.ignored();
        }
        return await workflow.execute({
            message,
            history,
            context
        });
    }
}

module.exports=WorkflowEngine;