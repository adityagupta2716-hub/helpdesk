import { useNavigate } from "react-router-dom";
import TicketCard from "./TicketCard";

function TicketListCard({ 
    list,
    role="student"
})
{
    const navigate=useNavigate();

    const {
        tickets=[],
        totalTickets=0,
        hasMore=false
    }=list;

    return(
        <div className="mt-4">

            {/* Header */}

            <div className="flex items-center justify-between mb-3">

                <p className="text-sm text-gray-500">
                    Showing {tickets.length} of {totalTickets} ticket{totalTickets!==1?"s":""}
                </p>

                {
                    hasMore &&
                    (
                        <button
                            onClick={()=>navigate(
                                role==="admin"
                                ?"/admin/tickets"
                                :"/student/tickets")}
                            className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                        >
                            View All
                        </button>
                    )
                }

            </div>

            {/* Ticket List */}

            <div className="space-y-3">

                {
                    tickets.map(ticket=>(
                        <TicketCard
                            key={ticket.id}
                            ticket={ticket}
                            role={role}
                        />
                    ))
                }

            </div>

        </div>
    );
}

export default TicketListCard;