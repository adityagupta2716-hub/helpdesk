class WorkflowResult
{
    constructor({
        handled=false,
        workflow=null,
        status="completed",
        response=null,
        nextAction=null,
        draft=null,
        ui=[],
        metadata={}
    })
    {
        this.handled=handled;

        this.workflow=workflow;

        this.status=status;

        this.response=response;

        this.nextAction=nextAction;

        this.draft=draft;

        this.ui=ui;

        this.metadata=metadata;
    }

    static handled({
        workflow,
        status,
        response,
        nextAction=null,
        draft=null,
        ui=[],
        metadata={}
    })
    {
        return new WorkflowResult({
            handled:true,
            workflow,
            status,
            response,
            nextAction,
            draft,
            ui,
            metadata
        });
    }

    static ignored()
    {
        return new WorkflowResult({
            handled:false
        });
    }
}

module.exports=WorkflowResult;