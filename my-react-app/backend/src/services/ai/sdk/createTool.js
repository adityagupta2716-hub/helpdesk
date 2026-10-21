const REQUIRED_FIELDS = [

    "name",

    "category",

    "description",

    "permissions",

    "parameters",

    "returns",

    "execute"

];

const createTool=(config)=>{

    for(const field of REQUIRED_FIELDS)
    {
        if(config[field]===undefined)
        {
            throw new Error(`Tool is missing required field "${field}."`);
        }
    }
    return Object.freeze({
        name: config.name,

        version: config.version ?? "1.0.0",

        category: config.category,

        description: config.description,

        enabled: config.enabled ?? true,

        permissions: config.permissions,

        parameters: config.parameters,

        returns: config.returns,

        metadata:{

            author:config.metadata?.author ?? "AI Agent",

            createdAt:config.metadata?.createdAt ?? new Date().toISOString(),

            tags:config.metadata?.tags ?? []
        },

        execute: config.execute,
    });
};

module.exports={
    createTool
};