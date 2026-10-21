const {
    createTool
}=require("../../../sdk/createTool.js");
const schema=require("./schema.js");
const {
    prepareTicketService
}=require("./service.js");

module.exports=createTool({
    name:"prepareTicket",
    version:"1.0.0",
    category:"tickets",
    description:"Collects all information required to prepare a support ticket before creation.",
    enabled:true,
    permissions:{
        roles:[
            "student"
        ],

        capabilities:{
            read:true,
            write:true,
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
        return await prepareTicketService(
            parameters,
            context
        );
    }
});