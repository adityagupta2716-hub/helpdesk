//import { adminRecentTickets } from "../../data/adminRecentTickets.js";
import StatusBadge from "../../../components/common/StatusBadge.jsx";
import PriorityBadge from "../../../components/common/PriorityBadge.jsx";

function AdminRecentTickets({tickets=[]}) {
    return (
        <div className="bg-white rounded-xl shadow p-6 mt-8">
            <h2 className="text-xl font-semibold mb-4">
                Recent Tickets
            </h2>

            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr className="border-b">
                            <th className="text-left py-3">
                                Ticket ID
                            </th>

                            <th className="text-left py-3">
                                Title
                            </th>

                            <th className="text-left py-3">
                                User
                            </th>

                            <th className="text-left py-3">
                                Status
                            </th>

                            <th className="text-left py-3">
                                Priority
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        tickets.length===0
                        ?(
                            <tr>
                                <td colSpan={6} className="text-center text-gray-500 py-8">
                                    No recent tickets found.
                                </td>
                            </tr>
                        ):(

                        tickets.map((ticket) => (
                            <tr
                                key={ticket._id}
                                className="border-b"
                            >
                                <td className="py-3">
                                    {ticket._id.slice(-6)}
                                </td>

                                <td className="py-3">
                                    {ticket.title}
                                </td>

                                <td className="py-3">
                                    {ticket.createdBy?.name}
                                </td>

                                <td className="py-3">
                                    <StatusBadge
                                        status={ticket.status}
                                    />
                                </td>

                                <td className="py-3">
                                    <PriorityBadge
                                        priority={ticket.priority}
                                    />
                                </td>
                            </tr>
                        ))
                        )
                    }
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminRecentTickets;