const {
    deepMerge
}=require("./utils/deepMerge.js");
const {
    safeAssign
}=require("./utils/safeAssign.js");

function mergePreparationResult(
    draft={},
    preparation={}
)
{
    const mergedDraft={
        ...(draft ?? {})
    };


    if(preparation.shouldMerge)
    {
        const changes=preparation.ticketChanges??{};

        mergedDraft.title=safeAssign(mergedDraft.title,changes.title);
        mergedDraft.description=safeAssign(mergedDraft.description,changes.description);
        mergedDraft.department=safeAssign(mergedDraft.department,changes.department);

        mergedDraft.category=safeAssign(
            mergedDraft.category,
            changes.category
        );

        mergedDraft.priority=safeAssign(
            mergedDraft.priority,
            changes.priority
        );
    }

    mergedDraft.context=deepMerge(
        mergedDraft.context??{},
        preparation.contextChanges??{}
    );

    const existingPreparation=mergedDraft.preparation??{};

    const pendingQuestion=
    preparation.nextQuestion
    ??
    existingPreparation.pendingQuestion
    ??
    null;

    mergedDraft.preparation={
        ...existingPreparation,
        pendingQuestion,
        missingFields:
        preparation.missingFields
        ??
        existingPreparation.missingFields
        ??
        [],

        ticketReady:
        preparation.ticketReady
        ??
        existingPreparation.ticketReady
        ??
        false,

        lastUpdatedAt:new Date()
    };
    return mergedDraft;
}

module.exports={
    mergePreparationResult
};