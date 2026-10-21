const {
    buildPlannerPrompt
}=require("./plannerPrompt");

const{
    buildPlannerContext
}=require("../context/plannerContextBuilder.js");

const {
    callPlannerModel
}=require("./model/plannerModel.js");

const {
    parsePlannerOutput
}=require("./plannerParser.js");

const {
    getPlannerTools
}=require("../registry/toolRegistry.js");
const { validateExecutionPlan } = require("./validation/plannerValidator.js");
const { normalizeExecutionPlan } = require("./normalization/plannerNormalizer.js");

async function plan({
    message,
    history,
    observations=[],
    previousPlans=[],
    memory,
    intent=null,
    conversationState=null,
    context
})
{
    const availableTools=getPlannerTools(context.role).sort(
        (a,b)=>a.name.localeCompare(b.name)
    );
    const plannerContext=buildPlannerContext({
        message,
        history,
        availableTools,
        observations,
        previousPlans,
        memory,
        intent,
        conversationState,
        role:context.role
    });
    const prompt=buildPlannerPrompt(plannerContext);
    const rawOutput=await callPlannerModel(prompt);
    console.log("\n========== RAW PLANNER OUTPUT ==========");
    console.log(rawOutput);
    console.log("========================================\n");
    const executionPlan=parsePlannerOutput(rawOutput);
    console.log("\n========== PARSED PLAN ==========");
    console.dir(executionPlan, {
        depth: null,
        colors: true
    });
    console.log("=================================\n");
    const validatedPlan=validateExecutionPlan(executionPlan,context.role);
    const normalizedPlan=normalizeExecutionPlan(validatedPlan);
    return normalizedPlan;
}

module.exports={
    plan
};