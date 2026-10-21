const {
    getTool
}=require("../registry/toolRegistry.js");

const {
    validateParameters
}=require("../validator/parameterValidator.js");

const executeTool=async({
    toolName,
    arguments: toolArguments={},
    context={}
})=>{
    const start=Date.now();
    try{
        const tool=getTool(toolName);
        if(!tool)
        {
            return{
                success:false,
                tool:toolName,
                duration:Date.now() - start,
                error:{
                    code:"TOOL_NOT_FOUND",
                    message:`Tool "${toolName}" does not exist.`
                }
            };
        }
        if(!tool.enabled)
        {
            return{
                success:false,
                tool:toolName,
                duration:Date.now()-start,
                error:{
                    code:"TOOL_DISABLED",
                    message:`Tool "${toolName}" is disabled.`
                }
            };
        }

        if(!tool.permissions.capabilities.aiCallable)
        {
            return{
                success:false,
                tool:tool.name,
                duration:Date.now()-start,
                error:{
                    code:"TOOL_NOT_ALLOWED",
                    message:`${tool.name} cannot be called by AI.`
                }
            };
        }

        const userRole=context.user?.role;

        if(!tool.permissions.roles.includes(userRole))
        {
            return{
                success:false,
                tool:toolName,
                duration:Date.now()-start,
                error:{
                    code:"PERMISSION_DENIED",
                    message:`Role "${userRole}" cannot execute "${toolName}".`
                }
            };
        }

        const validation=validateParameters(
            tool.parameters,
            toolArguments
        );

        if(!validation.valid)
        {
            return{
                success:false,
                tool:toolName,
                duration:Date.now()-start,
                error:{
                    code:"INVALID_PARAMETERS",
                    message:"Tool parameter validation failed.",
                    validationErrors:validation.errors
                }
            };
        }

        const result=await tool.execute(
            toolArguments,
            context
        );

        return {
            success: true,
            tool: tool.name,
            duration: Date.now()-start,
            result
        };
    }
    catch(error)
    {
        return{
            success:false,
            tool:toolName,
            duration:Date.now()-start,
            error:{
                code:"EXECUTION_FAILED",
                message:error.message
            }
        };
    }
};

module.exports={
    executeTool
};