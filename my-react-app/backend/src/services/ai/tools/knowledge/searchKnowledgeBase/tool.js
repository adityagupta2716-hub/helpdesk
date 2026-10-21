const {
    createTool
}=require("../../../sdk/createTool.js");

const schema=require("./schema.js");

const {
    searchKnowledgeBase
}=require("./service.js");

module.exports=createTool({
    name:"searchKnowledgeBase",
    version:"1.0.0",
    category:"knowledge",
    description:"Seaches the campus knowledge base using semantic similarity.",
    enabled:true,
    permissions:{
        roles:[
            "student",
            "staff",
            "admin"
        ],
        capabilities:{
            read:true,
            write:false,
            delete:false,
            externalNetwork:false,
            aiCallable:true
        }
    },
    parameters:schema.parameters,
    returns: schema.returns,

    execute:async(
        parameters,
        context
    )=>{
        const {
            query
        }=parameters;

        return await searchKnowledgeBase({
            query
        });
    }
});
