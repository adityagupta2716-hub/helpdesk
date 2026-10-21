export const TICKET_STATUS = {
    OPEN: "Open",
    ASSIGNED: "Assigned",
    IN_PROGRESS: "In Progress",
    PENDING_REVIEW: "Pending Review",
    RESOLVED: "Resolved",
    CLOSED: "Closed",
    CANCELED:"Canceled"
};

export const STAFF_STATUS_OPTIONS=[
    TICKET_STATUS.IN_PROGRESS,
    TICKET_STATUS.RESOLVED
];

export const TICKET_STATUS_OPTIONS =
    Object.values(TICKET_STATUS).map(status => ({
        value: status,
        label: status
    }));

export const getAdminStatusOptions=(ticket)=>{
    if(!ticket)
    {
        return [];
    }
    switch(ticket.status)
    {
        case "Open":
            return ticket.assignedTo
            ?["Assigned"]
            :["Assigned"];
        
        case "Assigned":
            return["In Progress"];
            
        case "In Progress":
            return[]

        case "Resolved":
            return[];

        case "Closed":
            return[];

        case "Canceled":
            return [];

        default:
            return [];
    }
};