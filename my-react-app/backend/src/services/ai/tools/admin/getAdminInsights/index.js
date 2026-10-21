const tool=require("./tool.js");

const{
    registerTool
}=require("../../../registry/toolRegistry.js");

registerTool(tool);

module.exports=tool;