const {
    createTool
}=require("../../../sdk/createTool.js");

const schema=require("./schema.js");

const {
    getAdminInsightsTool
}=require("./service.js");

module.exports=createTool({

    name:"getAdminInsights",

    version:"1.0.0",

    category:"admin",

    description:
    "Generates analytics and executive insights for administrators.",

    enabled:true,

    permissions:{
        roles:[
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
        return await getAdminInsightsTool(
            parameters,
            context
        );
    }

});