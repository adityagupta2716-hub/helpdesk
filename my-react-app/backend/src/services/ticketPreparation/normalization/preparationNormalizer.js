function normalizePreparation(preparation)
{
    preparation.thought ??= "";

    preparation.summary ??= "";

    preparation.workflow ??= "continue";
    const workflowAliases = {

        ticketReady: "ready",

        ticket_ready: "ready",

        ready_for_confirmation: "ready",

        readyToConfirm: "ready",

        completed: "ready",

        collect: "continue",

        collecting: "continue",

        continueCollecting: "continue",

        ask: "continue",

        stop: "cancel",

        cancelled: "cancel",

        interrupted: "interrupt"

    };

    if(typeof preparation.workflow==="string")
    {
        preparation.workflow=
            workflowAliases[preparation.workflow]
            ??
            preparation.workflow;
    }

    preparation.shouldMerge ??= false;

    preparation.ticketChanges ??= {};

    preparation.contextChanges ??= {};

    preparation.missingFields ??= [];

    preparation.preparationState ??= null;

    preparation.nextQuestion ??= null;

    preparation.ticketReady ??= false;

    preparation.confidence ??= "low";

    const confidenceAliases = {

        HIGH: "high",

        MEDIUM: "medium",

        LOW: "low"

    };

    preparation.confidence=
        confidenceAliases[preparation.confidence]
        ??
        String(preparation.confidence).toLowerCase();

    /*
    -------------------------------
    preparationState normalization
    -------------------------------
    */

    if(
        preparation.preparationState &&
        typeof preparation.preparationState==="object"
    )
    {
        preparation.preparationState.pendingField ??= null;

        preparation.preparationState.pendingQuestion ??= null;
    }

    /*
    -------------------------------
    nextQuestion normalization
    -------------------------------
    */

    if(
        preparation.nextQuestion &&
        typeof preparation.nextQuestion==="object"
    )
    {
        preparation.nextQuestion.field ??= null;

        preparation.nextQuestion.question ??= null;

        preparation.nextQuestion.reason ??= null;
    }

    /*
    -------------------------------
    missingFields normalization
    -------------------------------
    */

    preparation.missingFields=
    preparation.missingFields.map(field=>({

        field:field.field ?? null,

        reason:field.reason ?? ""

    }));

    return preparation;
}

module.exports={
    normalizePreparation
};