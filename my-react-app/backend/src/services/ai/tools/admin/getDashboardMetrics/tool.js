const {createTool}=require("../../../sdk/createTool.js");
const schema=require("./schema.js");
const{getDashboardMetricsTool}=require("./service.js");

module.exports=createTool({
    name:"getDashboardMetrics",
    version:"1.0.0",
    category:"admin",
    description:
    "Returns overall dashboard analytics for administrators.",
    enabled:true,
    permissions:{
        roles:["admin"],
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
    execute:async(parameters,context)=>{
        return await getDashboardMetricsTool();
    }
});