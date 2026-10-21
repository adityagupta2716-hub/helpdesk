import StatusBadge from "../common/StatusBadge.jsx";
import PriorityBadge from "../common/PriorityBadge.jsx";
import {Link} from "react-router-dom";
function TicketTable({tickets}){
    return(
        //<div className="bg-white rounded-xl shadow p-6 mt-6">
            <table className="min-w-full">
                <thead>
                    <tr className="border-b">
                        <th className="text-left py-5 whitespace-nowrap overflow-auto">
                            Ticket ID
                        </th>
                        <th className="text-left py-5">
                            Title
                        </th>
                        <th className="text-left py-5">
                            Category
                        </th>
                        <th className="text-left py-5 w-40">
                            Status
                        </th>
                        <th className="text-left py-5">
                            Priority
                        </th>
                        <th className="text-left py-5 whitespace-nowrap overflow-auto">
                            Created On
                        </th>
                        <th className="text-left py-5">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {tickets.map((ticket)=>(
                        <tr key={ticket._id} className="border-b">
                            <td className="py.5">
                                {ticket._id.slice(-6)}
                            </td>
                            <td className="py.5">
                                {ticket.title}
                            </td>
                            <td className="py.5">
                                {ticket.category}
                            </td>
                            <td className="py.5">
                               <StatusBadge status={ticket.status}/>
                            </td>
                            <td className="py.5">
                                <PriorityBadge priority={ticket.priority}/>
                            </td>
                            <td className="py.5">
                                {new Date(
                                    ticket.createdAt
                                ).toLocaleDateString()}
                            </td>
                            <td className="py-5">
                                <Link to={`/student/tickets/${ticket._id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                                   View 
                                </Link>
                            </td>
                        </tr>


                    ))}
                </tbody>
            </table>
        //</div>
    )
}
export default TicketTable;