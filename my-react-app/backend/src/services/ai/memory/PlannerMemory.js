class PlannerMemory
{
    constructor()
    {
        this.observations=[];
        this.facts=[];
        this.decisions=[];
    }
    addObservation(observation)
    {
        this.observations.push(observation);
    }
    addDecision(decision)
    {
        this.decisions.push(decision);
    }
    addFact(fact)
    {
        if(!this.facts.includes(fact))
        {
            this.facts.push(fact);
        }
    }

    getObservations()
    {
        return[...this.observations];
    }

    getFacts()
    {
        return[...this.facts];
    }

    getDecisions()
    {
        return[...this.decisions];
    }

    clear()
    {
        this.observations=[];
        this.facts=[];
        this.decisions=[];
    }
}

module.exports=PlannerMemory;