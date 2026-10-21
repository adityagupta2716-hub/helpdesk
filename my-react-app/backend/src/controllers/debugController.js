const CampusAgent=require("../services/ai/agent/CampusAgent.js");

const AgentContext=require("../services/ai/agent/AgentContext.js");

const testAgent=async(req,res)=>{
    try
    {
        const {
            message
        }=req.body;

        const agent=new CampusAgent();

        const context=new AgentContext({

            user:{
                _id:"6a2a90c3751b70adfdd85b21",
                role:"student"
            },

            session:null,

            request:req,

            response:res
        });

        const result=await agent.run({

            message,

            history:[],

            context
        });

        return res.status(200).json(result);

    }
    catch(error)
    {
        console.error("====== AGENT ERROR =========");
        console.error(error);
        console.error(error.stack);

        return res.status(500).json({

            message:error.message,
            stack:error.stack

        });
    }
};

module.exports={
    testAgent
};