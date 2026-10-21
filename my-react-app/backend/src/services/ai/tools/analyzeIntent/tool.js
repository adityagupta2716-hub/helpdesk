const {
    createTool
}=require("../../sdk/createTool.js");
const schema=require("./schema.js");

const {
    analyzeIntentTool
}=require("./service.js");

module.exports=createTool({
    name:"analyzeIntent",
    version:"1.0.0",
    category:"intent",
    description:"Classifies the student's message and extracts structured ticket information when applicable.",
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
    returns:schema.returns,
    execute:async(
        parameters,
        context
    )=>{
        return await analyzeIntentTool(
            parameters,
            context
        );
    }
});