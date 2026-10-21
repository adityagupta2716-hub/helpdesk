const {
    createTool
}=require("../../../sdk/createTool.js");
const schema=require("./schema.js");

const {
    getMyTickets
}=require("./service.js");

module.exports=createTool({
    name:"getMyTickets",
    version:"1.0.0",
    category:"tickets",
    description:"Returns all tickets created by the current student.",
    enabled:true,
    permissions:{
        roles:[
            "student"
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
        return await getMyTickets(
            parameters,
            context);
    }
});