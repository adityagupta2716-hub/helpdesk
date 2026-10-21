const {
    createTool
}=require("../../../sdk/createTool.js");

const schema=require("./schema.js");

const {
    getAllTicketsTool
}=require("./service.js");

module.exports=createTool({

    name:"getAllTickets",

    version:"1.0.0",

    category:"admin",

    description:
"Returns administrator tickets. Supports filtering by status, priority, department, category and creation date, along with pagination and full result retrieval.",

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
        return await getAllTicketsTool(
            parameters,
            context
        );
    }

});