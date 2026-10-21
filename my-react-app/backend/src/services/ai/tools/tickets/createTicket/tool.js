const {
    createTool
}=require("../../../sdk/createTool.js");
const schema=require("./schema.js");
const {createTicket}=require("./service.js");

module.exports=createTool({
    name:"createTicket",
    version:"1.0.0",
    category:"tickets",
    description:"Creates a new support ticket for the current student.",
    enabled:true,
    permissions:{
        roles:[
            "student"
        ],

        capabilities:{
            read:false,
            write:true,
            delete:false,
            externalNetwork:false,
            aiCallable:true
        }
    },

    parameters:schema.parameters,
    returns:schema.returns,
    execute: async(
        parameters,
        context
    )=>{
        return await createTicket(
            parameters,
            context
        );
    }
});