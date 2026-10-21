const AgentState=require("../agent/AgentState.js");

const {
    runLoop
}=require("./AgentLoop.js");

const WorkflowEngine=require("../workflow/workflowEngine.js");

const {
    generateAgentResponse
}=require("../responder/responseGenerator.js");

const PlannerError=require("../planner/errors/PlannerError.js");

class CampusAgent
{
    async run({
        message,
        history=[],
        context
    })
    {
        const state=new AgentState({
            message,
            history
        });

        const workflowEngine=new WorkflowEngine();
        const workflowResult=await workflowEngine.execute({
            message,
            history,
            context
        });

        if(workflowResult.handled)
        {
            return{
                success:true,
                response:workflowResult.response,
                ui:workflowResult.ui??[],
                workflow:workflowResult,
                state
            };
        }
        try{
        await runLoop({
            context,
            state
        });
        }
        catch(error)
        {
            if(error instanceof PlannerError)
            {
                return {
                    success:true,
                    response:
                    "Sorry, I cannot perform that action with your current role.",
                    ui:[],
                    workflow:null,
                    state
                };
            }
            throw error;
        }

        const response=await generateAgentResponse({
            message,
            history,
            observations:state.getObservations(),
            state,
            context
        });

        if(state.finalResponse)
        {
            state.finalResponse.response=response.response;
        }

        return{
            success:response.success,
            response:response.response,
            ui:response.ui??[],
            workflow:null,
            state
        };
    }
}

module.exports=CampusAgent;