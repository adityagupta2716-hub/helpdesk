function buildPreparationContext({
    latestMessage,
    history=[],
    draft=null,
    intent=null
})
{
    return {
        latestMessage,
        history,
        intent,
        currentDraft:draft,
        pendingQuestion:
        draft?.preparation?.pendingQuestion??null,

        pendingField:
        draft?.preparation?.pendingField??null,

        collectedInformation:
        draft?.collectedInformation??{},

        workflow:
        draft?.preparation?.workflow??"initial"
    };

}
module.exports={
    buildPreparationContext
};