const {
    getTool
}=require("../../registry/toolRegistry.js");
function normalizeExecutionPlan(plan)
{
    const normalizedPlan=structuredClone(plan);
    if(!normalizedPlan.decision)
    {
        normalizedPlan.decision="respond";
    }
    if(!normalizedPlan.confidence)
    {
        normalizedPlan.confidence="medium";
    }
    if(normalizedPlan.message===undefined)
    {
        normalizedPlan.message=null;
    }
    if(!normalizedPlan.thought)
    {
        normalizedPlan.thought="";
    }
    if(!Array.isArray(normalizedPlan.steps))
    {
        normalizedPlan.steps=[];
    }
    for(const step of normalizedPlan.steps)
    {
        const tool=getTool(step.tool);
        if(!tool)
        {
            continue;
        }
        if(!tool.enabled)
        {
            continue;
        }
        if(!step.parameters)
        {
            step.parameters={};
        }
        // for(const parameterName in tool.parameters)
        // {
        //     const schema=tool.parameters[parameterName];
        //     let value=step.parameters[parameterName];
        //     if(schema.type==="string" && typeof value==="string")
        //     {
        //         value=value.trim();
        //     }
        //     if(schema.type==="number" && typeof value==="string")
        //     {
        //         const parsed=Number(value);
        //         if(!Number.isNaN(parsed))
        //         {
        //             value=parsed;
        //         }
        //     }
        //     if(schema.type==="boolean" && typeof value==="string")
        //     {
        //         if(value==="true")
        //         {
        //             value=true;
        //         }
        //         if(value==="false")
        //         {
        //             value=false;
        //         }
        //     }
            // if(schema.enum && typeof value==="string")
            // {
            //     const match=schema.enum.find(
            //         option=>
            //             option.toLowerCase()===value.toLowerCase()
            //     );
            //     if(match)
            //     {
            //         value=match;
            //     }
            // }
            // if(value===undefined && schema.default!==undefined)
            // {
            //     value=schema.default;
            // }
            // step.parameters[parameterName]=value;

        // }

        const parameterDefinitions=tool.parameters.properties??{};
        for(const parameterName in parameterDefinitions)
        {
            const schema=parameterDefinitions[parameterName];
            let value=step.parameters[parameterName];
            if(schema.type==="string" && typeof value==="string")
            {
                value=value.trim();
            }
            if(schema.type==="number" && typeof value==="string")
            {
                const parsed=Number(value);
                if(!Number.isNaN(parsed))
                {
                    value=parsed;
                }
            }
            if(schema.type==="boolean" && typeof value==="string")
            {
                if(value==="true")
                {
                    value=true;
                }
                if(value==="false")
                {
                    value=false;
                }
            }
            if(schema.enum && typeof value==="string")
            {
                const match=schema.enum.find(
                    option=>
                        option.toLowerCase()===value.toLowerCase()
                );
                if(match)
                {
                    value=match;
                }
            }
            if(value===undefined && schema.default!==undefined)
            {
                value=schema.default;
            }
            if(value!==undefined)
            {
            step.parameters[parameterName]=value;
            }

        }
    }
    return normalizedPlan;
}

module.exports={
    normalizeExecutionPlan
};