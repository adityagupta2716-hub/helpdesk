const systemPrompt=require("../prompts/plannerSystemPrompt.js");

function simplifyObservation(observation)
{
    if(!observation)
    {
        return null;
    }
    const {
        tool,
        data
    }=observation;

    if(!data)
    {
        return null;
    }
    
    switch(tool)
    {
        case "searchKnowledgeBase":
            {
                return{
                    found:data.found,
                    confidence:data.confidence,
                    score:data.score,
                    bestMatch:data.bestMatch
                    ?{
                        question:data.bestMatch.question,
                        answer:data.bestMatch.answer,
                        category:data.bestMatch.category
                    }
                    :null,

                    topMatches:data.topMatches?.map(match=>({
                        question:match.question,
                        answer:match.answer,
                        category:match.category,
                        score:match.score
                    })).filter(match=>match.question)
                };
            }
        
            case "analyzeIntent":
                {
                    return {
                        intent:data.intent,
                        department:data.department,
                        category:data.category,
                        priority:data.priority,
                        title:data.title,
                        description:data.description,
                        draftAction:data.draftAction,
                        needsMoreInfo:data.needsMoreInfo
                    };
                }
            case "createTicket":
                {
                    return{
                        ticketId:data.ticketId,
                        status:data.status,
                        title:data.title
                    };
                }
            case "getMyTickets":
                {
                    return{
                        totalTickets:data.totalTickets,
                        matchingTickets:data.matchingTickets,
                        returnedTickets:data.returnedTickets,
                        tickets:data.tickets
                    };
                }

            default:
                {
                    return data;
                }
    }
}

function buildPlannerPrompt({
    message,
    history,
    availableTools,
    observations=[],
    previousPlans=[],
    memory=null,
    intent=null,
    role=null
})
{
    const memoryText=
    !memory
    ?"Planner memory unavailable"
    :`
    Known Facts
    
    ${memory.facts.length===0?"None"
        :memory.facts.map(fact=>`• ${fact}`).join("\n")}
    
    -------------------------------------------------
    
    Previous Decisions
    ${memory.decisions.length===0
        ?"None"
        :memory.decisions.map(decision=>`
            Iteration: ${decision.iteration}
            
            Decision: ${decision.decision}
            
            Reasoning: ${decision.thought}
            `).join("\n")
    }`;
    const historyText=history.slice(-8).map(message=>
        `${message.sender}: ${message.content}`
    ).join("\n");

    const observationText=observations.length===0
    ?"No previous observations."
    :observations.map(observation=>`
        Iteration:
        ${observation.iteration}
        
        Tool:
        ${observation.tool}
        
        Status:
        ${observation.success?"SUCCESS":"FAILED"}
        
        Arguments:
        ${JSON.stringify(observation.arguments,null,2)}
        
        Summary:
        ${observation.summary}

        Data:
        ${JSON.stringify(simplifyObservation(observation),null,2)}

        Error:
        ${observation.error??"None"}
        
        Duration:
        ${observation.duration} ms
        
        `).join("\n");

        const previousPlansText=
        previousPlans.length===0?"No previous plans."
        :previousPlans.map(plan=>
            JSON.stringify(plan,null,2)
        ).join("\n");

    const latestObservationSummary=observations.length===0?"None":
    JSON.stringify(
        {
            iteration:observations.at(-1).iteration,
            tool:observations.at(-1).tool,
            success:observations.at(-1).success,
            summary:observations.at(-1).summary,
            data:simplifyObservation(observations.at(-1)),
            error:observations.at(-1).error
        },
        null,
        2
    );

    const toolText=availableTools.map(tool=>
        `
        ==============================================

        TOOL NAME:
        ${tool.name}

        CATEGORY:
        ${tool.category}

        DESCRIPTION: 
        ${tool.description}
        
        PERMISSIONS:
        ${JSON.stringify(tool.permissions,null,2)}


        PARAMETERS:
        ${JSON.stringify(tool.parameters,null,2)}

        RETURNS:
        ${JSON.stringify(tool.returns,null,2)}
        
        ==============================================
        `
    ).join("\n");

    return `
${systemPrompt}

==================================================

AVAILABLE TOOLS

${toolText}

==================================================

PREVIOUS EXECUTION PLANS

${previousPlansText}

==================================================

PLANNER MEMORY

${memoryText}

==================================================

EXECUTION OBSERVATIONS

${observationText}

==================================================

LATEST OBSERVATION SUMMARY

${latestObservationSummary}

==================================================

CONVERSATION HISTORY

${historyText}

==================================================

INTENT ANALYSIS

${intent
?
JSON.stringify(intent,null,2)
:
"No intent analysis available."}

==================================================

CURRENT USER ROLE

${role ?? "Unknown"}

==================================================

CURRENT USER MESSAGE

${message}

==================================================

Return ONLY valid JSON.
`;
}

module.exports={
    buildPlannerPrompt
};