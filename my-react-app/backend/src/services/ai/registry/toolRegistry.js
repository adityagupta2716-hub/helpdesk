

const tools=new Map();

let registryLocked=false;

const deepFreeze=(object)=>{
    Object.freeze(object);
    Object.getOwnPropertyNames(object).forEach((property)=>{
        const value=object[property];
        if(value && typeof value==="object" && !Object.isFrozen(value))
        {
            deepFreeze(value);
        }
    });
    return object;
}
const validateTool = (tool) => {
    if (!tool || typeof tool !== "object") {
        throw new Error("Tool must be an object.");
    }

    if (!tool.name || typeof tool.name !== "string") {
        throw new Error("Tool must have a valid name.");
    }

    if (!tool.version || typeof tool.version !== "string") {
        throw new Error(
            `Tool "${tool.name}" must define a version.`
        );
    }

    if (!tool.category || typeof tool.category !== "string") {
        throw new Error(
            `Tool "${tool.name}" must define a category.`
        );
    }

    if (!tool.description || typeof tool.description !== "string") {
        throw new Error(
            `Tool "${tool.name}" must define a description.`
        );
    }

    if (typeof tool.enabled !== "boolean") {
        throw new Error(
            `Tool "${tool.name}" must define enabled:true/false.`
        );
    }

    if (!tool.permissions || typeof tool.permissions !== "object") {
        throw new Error(
            `Tool "${tool.name}" must define permissions.`
        );
    }

    if (!Array.isArray(tool.permissions.roles)) {
        throw new Error(
            `Tool "${tool.name}" permissions.roles must be an array.`
        );
    }

    if (!tool.permissions.capabilities || typeof tool.permissions.capabilities !== "object") {
        throw new Error(
            `Tool "${tool.name}" must define permissions.capabilities.`
        );
    }

    const capabilities=[
        "read",
        "write",
        "delete",
        "externalNetwork",
        "aiCallable"
    ];

    for(const capability of capabilities)
    {
        if(typeof tool.permissions.capabilities[capability]!=="boolean")
        {
            throw new Error(
                `Tool "${tool.name}" permissions.capabilities.${capability} must be boolean.`
            );
        }
    }

    if (!tool.parameters || typeof tool.parameters !== "object") {
        throw new Error(
            `Tool "${tool.name}" must define parameters.`
        );
    }

    if (!tool.returns || typeof tool.returns !== "object") {
        throw new Error(
            `Tool "${tool.name}" must define returns schema.`
        );
    }

    if (typeof tool.execute !== "function") {
        throw new Error(
            `Tool "${tool.name}" must implement execute().`
        );
    }
};

const registerTool=(tool)=>{
    if(registryLocked){
        throw new Error("Tool registry has already been locked.");
    }

    validateTool(tool);

    if(tools.has(tool.name))
    {
        throw new Error(`Duplicate tool "${tool.name}".`);
    }

    tools.set(tool.name,deepFreeze(tool));
    console.log("\nREGISTERED TOOL:", tool.name);

    console.dir(tool.parameters, {
        depth: null,
        colors: true
    });

    console.log("--------------------------------");

};

const lockRegistry=()=>{
    registryLocked=true;
};

const getTool=(toolName)=>{
    return tools.get(toolName);
};

const getAllTools=()=>{
    return [...tools.values()];
};

const getToolNames=()=>{
    return [...tools.keys()];
};

const getEnabledTools=()=>{
    return getAllTools().filter(tool=>tool.enabled);
};

const getPlannerTools=(role=null)=>{
    return getEnabledTools().filter(tool=>tool.permissions.capabilities.aiCallable &&(
        role === null ||
        tool.permissions.roles.includes(role)
    ))
    .map(tool=>({
        name:tool.name,

        description:tool.description,

        parameters:tool.parameters,

        category: tool.category,

        permissions:tool.permissions,

        returns:tool.returns
    }));
};

const getToolsByCategory=(category)=>{
    return getEnabledTools().filter(tool=>tool.category===category);
};

const getToolsByCapability=(capability)=>{
    return getEnabledTools().filter(tool=>
        tool.permissions.capabilities[capability]
    );
};

const hasTool=(toolName)=>{
    return tools.has(toolName);
};

module.exports={
    registerTool,
    lockRegistry,
    getTool,
    getAllTools,
    getEnabledTools,
    getPlannerTools,
    hasTool,
    getToolNames,
    getToolsByCategory,
    getToolsByCapability
};