const {
    hasTool,
    getTool
}=require("../../registry/toolRegistry.js");

const PlannerError=require("../errors/PlannerError.js");

function validateExecutionPlan(plan,role)
{
    if(!plan  || typeof plan!=="object")
    {
        throw new PlannerError(
            "Planner did not return an object."
        );
    }
    if(!Array.isArray(plan.steps))
    {
        throw new PlannerError(
            "Planner output must contain a steps array"
        );
    }
    const VALID_DECISIONS=[
        "execute_tools",
        "respond",
        "ask_user",
        "finish"
    ];
    if(!VALID_DECISIONS.includes(plan.decision))
    {
        throw new PlannerError(
            `Invalid planner decision "${plan.decision}".`
        );
    }
    if(plan.decision==="execute_tools" && plan.steps.length===0)
    {
        throw new PlannerError(
            "execute_tools requires at least one step."
        );
    }
    if(plan.decision!=="execute_tools" && plan.steps.length>0)
    {
        throw new PlannerError(
            "Only execute_tools may contain steps."
        );
    }
    if(plan.decision==="ask_user" && !plan.message)
    {
        throw new PlannerError(
            "ask_user requires a message"
        );
    }

    if(plan.steps.length===0)
    {
        return plan;
    }

    const MAX_STEPS=10;
    if(plan.steps.length>MAX_STEPS)
    {
        throw new PlannerError(
            `Planner exceeded maximum number of steps (${MAX_STEPS}).`
        );
    }
    for(const step of plan.steps)
    {
        if(!step || typeof step!=="object")
        {
            throw new PlannerError(
                "Planner step must be an object."
            );
        }
        if(typeof step.tool!=="string")
        {
            throw new PlannerError(
                "Planner step is missing a valid tool name."
            )
        }
        if(!hasTool(step.tool))
        {
            throw new PlannerError(
                `Unknown tool "${step.tool}".`
            )
        }
        const tool=getTool(step.tool);
        if(!tool.permissions.capabilities.aiCallable)
        {
            throw new PlannerError(
                `Tool "${tool.name}" cannot be called by AI.`
            );
        }
        if(!tool.enabled)
        {
            throw new PlannerError(
                `Tool "${tool.name}" is disabled.`
            );
        }
        if(role && !tool.permissions.roles.includes(role))
        {
            throw new PlannerError(
                `Planner selected "${tool.name}" but role "${role}" is not allowed to use it.`
            )
        }
        if(step.parameters===undefined)
        {
            step.parameters={};
        }
        if(typeof step.parameters!=="object")
        {
            throw new PlannerError(
                `"${tool.name}" parameters must be an object.`
            );
        }
        // for(const parameterName in tool.parameters)
        // {
        //     const schema=tool.parameters[parameterName];
        //     if(schema.required && !(parameterName in step.parameters))
        //     {
        //         throw new PlannerError(
        //             `Missing parameter "${parameterName}" for tool "${tool.name}".`
        //         );
        //     }
        // }

        const parameterDefinitions=tool.parameters.properties ?? {};

        const requiredParameters=tool.parameters.required ?? [];

        for(const parameterName of requiredParameters)
        {
            if(!(parameterName in step.parameters))
            {
                throw new PlannerError(
                    `Missing parameter "${parameterName}" for tool "${tool.name}".`
                );
            }
        }


        for( const parameterName in step.parameters)
        {
            const schema=parameterDefinitions[parameterName];
            if(!schema)
            {
                throw new PlannerError(
                    `Unknown parameter "${parameterName}" for "${tool.name}".`
                );
            }
            const value=step.parameters[parameterName];
            if(
                schema.type==="string" &&
                typeof value!=="string"
            )
            {
                throw new PlannerError(
                    `"${parameterName}" must be a string.`
                );
            }
            if(
                schema.type==="number" &&
                typeof value!=="number"
            )
            {
                throw new PlannerError(
                    `"${parameterName}" must be a number.`
                );
            }
            if(
                schema.type==="boolean" &&
                typeof value!=="boolean"
            )
            {
                throw new PlannerError(
                    `"${parameterName}" must be a boolean.`
                );
            }
        }
    }
    return plan;
}

module.exports={
    validateExecutionPlan
};