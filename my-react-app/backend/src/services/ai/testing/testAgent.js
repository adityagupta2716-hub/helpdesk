const CampusAgent=require("../agent/CampusAgent.js");

const AgentContext=require("../runtime/AgentContext.js");

async function main()
{
    const agent=new CampusAgent();

    const context=new AgentContext({

        user:{
            _id:"debug-user",

            role:"student"
        },

        session:null,

        request:{},

        response:{}
    });

    const result=await agent.run({

        message:"How do I reset my VTOP password?",

        history:[],

        context
    });

    console.log("\n==============================");
    console.log("FINAL AGENT RESULT");
    console.log("==============================\n");

    console.dir(result,{
        depth:null,
        colors:true
    });

}

main().catch(console.error);