const {
    buildDateQuery
}=require("./dateQueryBuilder.js");

function buildTicketQuery(filters={})
{
    const {
        dateFilter,
        status,
        priority,
        department,
        category,
        createdBy,
        assignedTo,
        search
    }=filters;

    const query={};

    if(status)
    {
        query.status=status;
    }

    if(priority)
    {
        query.priority=priority;
    }

    if(department)
    {
        query.department=department;
    }

    if(category)
    {
        query.category=category;
    }

    if(createdBy)
    {
        query.createdBy=createdBy;
    }

    if(assignedTo)
    {
        query.assignedTo=assignedTo;
    }

    if(dateFilter)
    {
        const field=dateFilter.field ?? "createdAt";

        query[field]=buildDateQuery(dateFilter);
    }

    if(search)
    {
        query.$and=[];

        query.$and.push({
            $or:[
                {
                    title:{
                        $regex:search,
                        $options:"i"
                    }
                },
                {
                    description:{
                        $regex:search,
                        $options:"i"
                    }
                }
            ]
        });
    }

    return query;
}

module.exports={
    buildTicketQuery
};