class UIComponent
{
    constructor({
        type,
        data={}
    })
    {
        this.type=type;
        this.data=data;
    }

    static ticket(ticket)
    {
        return new UIComponent({

            type:"ticket_card",

            data:ticket

        });
    }

    static ticketList({
        tickets,
        totalTickets,
        hasMore
    })
    {
        return new UIComponent({

            type:"ticket_list",

            data:{
                tickets,
                totalTickets,
                hasMore
            }

        });
    }

    static notification(notification)
    {
        return new UIComponent({
            type:"notification",
            data:notification
        });
    }
}

module.exports=UIComponent;