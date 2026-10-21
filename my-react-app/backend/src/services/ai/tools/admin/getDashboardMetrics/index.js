const tool=require("./tool");

const {
    registerTool
}=require("../../../registry/toolRegistry");

registerTool(tool);

module.exports=tool;