class ExecutionObservation
{
    constructor({
        iteration,

        tool,

        arguments:toolArguments,

        success,

        result=null,

        error=null,

        startedAt,

        finishedAt
    })
    {
        this.iteration=iteration;

        this.tool=tool;

        this.arguments=toolArguments;

        this.success=success;

        this.result=result;

        this.summary=result?.summary ?? "";

        this.data=result?.data ?? null;

        this.ui=result?.ui ?? null;

        console.log("\n===== EXECUTION OBSERVATION UI =====");
        console.dir(this.ui,{
            depth:null,
            colors:true
        });

        this.metadata=result?.metadata ?? {};

        this.warnings=result?.warnings ?? [];

        this.error=error;

        this.startedAt=startedAt;

        this.finishedAt=finishedAt;

        this.duration=
            finishedAt.getTime()-
            startedAt.getTime();
    }

    get failed()
    {
        return !this.success;
    }

    get succeeded()
    {
        return this.success;
    }
}

module.exports=ExecutionObservation;