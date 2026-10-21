const PlannerMemory=require("../memory/PlannerMemory.js");
class AgentState
{
    constructor({
        message,
        history=[]
    })
    {
        this.message=message;
        this.history=history;
        this.executionHistory=[];
        this.toolResults=[];
        this.ui=[];
        this.iteration=0;
        this.currentPlan=null;
        this.completed=false;
        this.finalResponse=null;
        this.memory=new PlannerMemory();
        this.workflow={
            active:null,
            status:null,
            pendingQuestion:null,
            metadata:{}
        };
        this.metadata={
            startedAt:new Date(),
            finishedAt:null,
            totalExecutionTime:0,
            toolExecutionTime:0
        };
    }
    incrementIteration()
    {
        this.iteration++;
    }
    setCurrentPlan(plan)
    {
        this.currentPlan=plan;
        this.memory.addDecision({
            iteration:this.iteration,
            thought:plan.thought,
            decision:plan.decision
        });
    }
    addExecution({plan,observations})
    {
        this.executionHistory.push({
            iteration:this.iteration,
            timestamp:new Date(),
            plan,
            observations,
        });
    }
    addToolResult(observation)
    {
        this.toolResults.push(observation);
        if(observation.ui)
        {
            if(Array.isArray(observation.ui))
            {
                this.ui.push(...observation.ui);
            }
            else
            {
                this.ui.push(observation.ui);
            }
        }
        this.memory.addObservation(observation);
        if(observation.summary)
        {
            this.memory.addFact(observation.summary);
        }
        this.metadata.toolExecutionTime+=
        observation.duration??0;
    }
    getLatestToolObservation(toolName)
    {
        for(let i=this.toolResults.length-1;i>=0;i--)
        {
            if(this.toolResults[i].tool===toolName)
            {
                return this.toolResults[i];
            }
        }
        return null;
    }
    hasObservation(toolName)
    {
        return this.toolResults.some(
            observation=>observation.tool===toolName
        );
    }
    complete({
        decision,
        response=null,
        message=null
    })
    {
        this.completed=true;
        this.finalResponse={
            decision,
            response,
            message
        };
        this.metadata.finishedAt=new Date();
        this.metadata.totalExecutionTime=
        this.metadata.finishedAt.getTime()-
        this.metadata.startedAt.getTime();
    }
    getExecutionHistory()
    {
        return [...this.executionHistory];
    }
    getObservations()
    {
        return[...this.toolResults];
    }
    getPreviousPlan()
    {
        return this.executionHistory.map(
            execution=>execution.plan
        );
    }
    getPlannerMemory()
    {
        return{
            observations:
            this.memory.getObservations(),

            facts:
            this.memory.getFacts(),

            decisions:
            this.memory.getDecisions()
        };
    }
    getUI()
    {
        return [...this.ui];
    }
    setWorkflow({
        active,
        status,
        pendingQuestion=null,
        metadata={}
    })
    {
        this.workflow={
            active,
            status,
            pendingQuestion,
            metadata
        };
    }

    clearWorkflow()
    {
        this.workflow={
            active:null,
            status:null,
            pendingQuestion:null,
            metadata:{}
        };
    }
    getWorkflow()
    {
        return{
            ...this.workflow
        };
    }
}



module.exports=AgentState;