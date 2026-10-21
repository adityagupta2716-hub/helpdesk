const {
    executeTool
}=require("./toolExecutor.js");

const ExecutionObservation=require("./ExecutionObservation.js");

async function executePlan({
    plan,
    context,
    state
})
{
    if(!plan.steps.length)
    {
        return [];
    }
    const executionResults=[];
    
    for(const step of plan.steps)
    {
        const startedAt=new Date();
        try{
            const result=await executeTool({
                toolName:step.tool,
                arguments:step.parameters,
                context
            });
            const finishedAt=new Date();
            console.log("\n================================");
            console.log(`TOOL EXECUTED : ${step.tool}`);
            console.log("================================");

            console.dir(result,{
                depth:null,
                colors:true
            });
            const observation= new ExecutionObservation({
                iteration:state.iteration,
                tool:step.tool,
                arguments:step.parameters,
                success:result.success,
                result: result.success? result.result : null,
                error: result.success? null : result.error,
                startedAt,
                finishedAt
            });
            state.addToolResult(observation);
            executionResults.push(observation);
        }
        catch(error)
        {
            const finishedAt=new Date();
            const observation=new ExecutionObservation({
                iteration:state.iteration,
                tool:step.tool,
                arguments:step.parameters,
                success:false,
                error:error.message,
                startedAt,
                finishedAt
            });
            state.addToolResult(observation);
            executionResults.push(observation);
            throw error;
        }
    }
    state.addExecution({
        plan,
        observations:executionResults
    });
    return executionResults;
}

module.exports={
    executePlan
};