class AgentContext
{
    constructor({
        user,
        session,
        request,
        response,
        requestId=null,
        services={},
        intent=null,

        activeDraft=null,
        history=[]
    })
    {
        this.user=user;
        this.session=session;
        this.request=request;
        this.response=response;
        this.requestId=requestId,
        this.services=services;
        this.intent=intent;
        this.activeDraft=activeDraft;
        this.history=history;
    }
    get role()
    {
        return this.user.role;
    }
    get userId()
    {
        if(!this.user || !this.user._id)
        {
            return null;
        }
        return this.user._id.toString();
    }
    get sessionId()
    {
        return this.session?._id?.toString()??null;
    }

    get isIssue()
    {
        return this.intent?.intent==="issue";
    }

    get needsMoreInfo()
    {
        return this.intent?.needsMoreInfo===true;
    }

    get draftAction()
    {
        return this.intent?.draftAction;
    }

    get ticketData()
    {
        if(!this.intent)
        {
            return null;
        }

        return{

            title:this.intent.title,

            description:this.intent.description,

            department:this.intent.department,

            category:this.intent.category,

            priority:this.intent.priority

        };
    }

    get draft()
    {
        return this.activeDraft;
    }

    get conversationState()
    {
        if(!this.activeDraft)
        {
            return{
                activeWorkflow:null,
                pendingField:null,
                pendingQuestion:null,
                ticketReady:false,
                currentDraft:null
            };
        }

        return{
            activeWorkFlow:"ticketPreparation",
            pendingField:
            this.activeDraft.preparation
            ?.pendingQuestion?.field??null,

            pendingQuestion:
            this.activeDraft.preparation?.pendingQuestion??null,

            ticketReady:
            this.activeDraft.preparation?.ticketReady??false,

            currentDraft:{
                title:this.activeDraft.title,
                description:this.activeDraft.description,
                department:this.activeDraft.department,
                category:this.activeDraft.category,
                priority:this.activeDraft.priority
            }
        };
    }

    get latestUserMessage()
    {
        if(!this.history.length)
        {
            return null;
        }

        for(let i=this.history.length-1;i>=0;i--)
        {
            if(this.history[i].sender==="user")
            {
                return this.history[i];
            }
        }
        return null;
    }
}
module.exports=AgentContext;