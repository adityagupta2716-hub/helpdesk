const {
    buildTransitionPrompt
}=require("./transitionPrompt.js");
const {
    callJsonModel
}=require("../../../../utils/callJsonModel.js");
const VALID_TRANSITIONS=new Set([
    "CONFIRM",
    "CANCEL",
    "MODIFY",
    "INTERRUPT",
    "UNKNOWN"
]);

const VALID_CONFIDENCE=new Set([
    "high",
    "medium",
    "low"
]);

async function classifyTransition({
    latestMessage,
    history=[],
    workflow,
    workflowState={},
    draft={}
})
{
    const prompt=buildTransitionPrompt({
        latestMessage,
        history,
        workflow,
        workflowState,
        draft
    });

    const result=await callJsonModel(
        prompt,
        {
            temperature:0,
            maxOutputTokens:256
        }
    );

    validate(result);

    return {
        thought:result.thought,
        transition:result.transition,
        confidence:result.confidence,
        reasoning:result.reasoning
    };
}

function validate(result)
{
    if(typeof result !=="object" || result===null)
    {
        throw  new Error(
            "Transition classifer returned an invalid response."
        );
    }
    if(!VALID_TRANSITIONS.has(result.transition))
    {
        throw new Error(
            `Invalid transition "${result.transition}".`
        );
    }
    if(!VALID_CONFIDENCE.has(result.confidence))
    {
        throw new Error(
            `Invalid confidence "${result.confidence}"`
        );
    }
    if(typeof result.thought!=="string")
    {
        throw new Error(
            "Transition classifier is missing 'thought'."
        );
    }
    if(typeof result.reasoning!=="string")
    {
        throw new Error(
            "Transition classifier is missing 'reasoning'."
        );
    }
}

module.exports={
    classifyTransition
};