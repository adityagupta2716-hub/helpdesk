const model=require("../../aiClient.js");

const {
    buildResponsePrompt
}=require("./responsePrompt.js");

const {
    detectSmallTalk
}=require("../../chatPreprocessorService.js");

async function generateAgentResponse({
    message,
    history=[],
    observations=[],
    state
})
{
    const smallTalk=detectSmallTalk(message);
    if(
        smallTalk.isSmallTalk
    )
    {
        return{
            success:true,
            response:smallTalk.response,
            ui:state?.getUI()??[]
        };
    }
    if(state.finalResponse?.decision==="ask_user")
    {
        return{
            success:true,
            response:state.finalResponse.message,
            ui:state.getUI()
        };
    }
    if(state.finalResponse?.decision==="finish")
    {
        return{
            success:true,
            response:
            state.finalResponse.response??
            "Done.",
            ui:state.getUI()
        };
    }
    const prompt=buildResponsePrompt({
        message,
        history,
        observations,
        state
    });

    try{
        const timeoutPromise=new Promise(
            (_,reject)=>
                setTimeout(
                    ()=>reject(
                        new Error("Gemini timeout")
                    ),
                    20000
                )
        );

        const result=await Promise.race([
            model.generateContent(prompt),
            timeoutPromise
        ]);
        console.log("\n================================");
        console.log("FINAL RESPONSE");
        console.log("================================");

console.log(result.response.text());
        return {
            success:true,
            response:result.response.text(),
            ui:state.getUI()
        };
    }
    catch(error)
    {
        console.error(
            "[Response Generator]",
            error.message
        );

        return{
            success:false,
            response:
            "I couldn't generate a response at the moment.",

            ui:state?.getUI() ?? []
        };
    }
}

module.exports={
    generateAgentResponse
};