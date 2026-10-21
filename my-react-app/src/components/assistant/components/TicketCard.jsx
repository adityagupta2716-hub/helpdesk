import { useNavigate } from "react-router-dom";

import PriorityBadge from "../../common/PriorityBadge";

import StatusBadge from "../../common/StatusBadge";

function TicketCard({ ticket, role="student" }) {
    const navigate = useNavigate();
    const ticketRoute=
    role==="admin"
    ?`/admin/tickets/${ticket.id}`
    :`/student/tickets/${ticket.id}`

    return (
        <div
            onClick={() =>
                navigate(ticketRoute)
            }
            className="mt-3 border rounded-xl p-4 cursor-pointer hover:bg-gray-50 transition"
        >
            <div className="flex justify-between items-start">
                <h3 className="font-semibold">
                    {ticket.title}
                </h3>
                <PriorityBadge priority={ticket.priority}/>
            </div>
            
            <div className="flex gap-2 mt-3">
                <StatusBadge status={ticket.status}/>
                
            </div>

            <div className="mt-3 flex flex-wrap gap-2 text-sm text-gray-600">
                <span>{ticket.department}</span>

                <span>•</span>

                <span>{ticket.category}</span>

            </div>
            

            <div className="mt-4 text-blue-600 text-sm font-medium">
                View Ticket →
            </div>
        </div>
    );
}

export default TicketCard;