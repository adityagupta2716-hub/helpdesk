const {
    plan
}=require("../planner/plannerService.js");
const{
    executePlan
}=require("../executor/ExecutionManager.js");

async function runLoop({
    context,
    state
})
{
    const MAX_ITERATIONS=5;
    while(
        !state.completed && state.iteration<MAX_ITERATIONS
    )
    {
        const executionPlan=await plan({
            message:state.message,
            history:state.history,
            observations:state.toolResults,
            previousPlans:
            state.getPreviousPlan(),
            memory:state.getPlannerMemory(),
            intent:context.intent,
            conversationState:context.conversationState,
            context
        });
        console.log("\n================================");
        console.log("PLANNER OUTPUT");
        console.log("================================");

        console.dir(
            executionPlan,
            {
                depth:null,
                colors:true
            }
        );
        state.setCurrentPlan(
            executionPlan
        );
        switch(executionPlan.decision)
        {
            case "respond":
                {
                    state.complete({
                        decision:"respond"
                    });
                    return state;
                }
            case "ask_user":
                {
                    state.complete({
                        decision:"ask_user",
                        message:executionPlan.message
                    });
                    return state;
                }
            case "finish":
                {
                    state.complete({
                        decision:"finish"
                    });
                    return state;
                }
            case "execute_tools":
                {
                    break;
                }
            default:
                {
                    throw new Error(
                        `Unknown planner decision "${executionPlan.decision}"`
                    )
                }

        }
        await executePlan({
            plan:executionPlan,
            context,
            state
        });
        state.incrementIteration();
    }
    return state;
}
module.exports={
    runLoop
};