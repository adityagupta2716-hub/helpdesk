class PreparationError extends Error
{
    constructor(message)
    {
        super(message);
        this.name="PreparationError";
    }
}

const VALID_WORKFLOWS=[
    "continue",
    "ready",
    "cancel",
    "interrupt"
];

const VALID_CONFIDENCE=[
    "high",
    "medium",
    "low"
];

const ALLOWED_TICKET_FIELDS=[
    "title",
    "description",
    "department",
    "category",
    "priority"
];

// const ALLOWED_CONTEXT_FIELDS=[
//     "location",
//     "hostelBlock",
//     "roomNumber",
//     "building",
//     "floor",
//     "lab",
//     "systemNumber",
//     "device",
//     "course",
//     "faculty",
//     "timeObserved",
//     "additionalNotes"
// ];

function validatePreparation(preparation)
{
    if(!preparation || typeof preparation!=="object")
    {
        throw new PreparationError(
            "Preparation output must be an object."
        );
    }

    if(!VALID_WORKFLOWS.includes(preparation.workflow))
    {
        throw new PreparationError(
            `Invalid workflow "${preparation.workflow}".`
        );
    }

    if(
        preparation.shouldMerge!==undefined &&
        typeof preparation.shouldMerge!=="boolean"
    )
    {
        throw new PreparationError(
            "shouldMerge must be a boolean."
        );
    }

    if(
        preparation.ticketChanges!==undefined &&
        typeof preparation.ticketChanges!=="object"
    )
    {
        throw new PreparationError(
            "ticketChanges must be an object."
        );
    }

    if(
        preparation.contextChanges!==undefined &&
        typeof preparation.contextChanges!=="object"
    )
    {
        throw new PreparationError(
            "contextChanges must be an object."
        );
    }

    if(
        preparation.missingFields!==undefined &&
        !Array.isArray(preparation.missingFields)
    )
    {
        throw new PreparationError(
            "missingFields must be an array."
        );
    }

    if(
        preparation.ticketReady!==undefined &&
        typeof preparation.ticketReady!=="boolean"
    )
    {
        throw new PreparationError(
            "ticketReady must be a boolean."
        );
    }

    if(
        preparation.confidence!==undefined &&
        !VALID_CONFIDENCE.includes(preparation.confidence)
    )
    {
        throw new PreparationError(
            `Invalid confidence "${preparation.confidence}".`
        );
    }

    if(preparation.ticketChanges)
    {
        for(const field of Object.keys(preparation.ticketChanges))
        {
            if(!ALLOWED_TICKET_FIELDS.includes(field))
            {
                throw new PreparationError(
                    `Invalid ticket field "${field}".`
                );
            }
        }
    }

    return preparation;
}

module.exports={
    validatePreparation
};