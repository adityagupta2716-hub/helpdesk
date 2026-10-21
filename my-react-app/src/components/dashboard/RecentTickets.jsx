import StatusBadge from "../common/StatusBadge.jsx";
function RecentTickets({tickets}){
    return(
        <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
                Recent Tickets
            </h2>
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr className="border-b">
                            <th className="text-left py-2">
                                Ticket ID
                            </th>
                            <th className="text-left py-2">
                                Title
                            </th>
                            <th className="text-left py-2">
                                Category
                            </th>
                            <th className="text-left py-2">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.map((ticket)=>
                        {
                            return(
                            <tr key={ticket._id} className="border-b">
                                <td className="py-3">
                                    {ticket._id.slice(-6)}
                                </td>
                                <td className="py-3">
                                    {ticket.title}
                                </td>
                                <td className="py-3">
                                    {ticket.category}
                                </td>
                                <td className="py-3">
                                    <StatusBadge status={ticket.status}/>
                                </td>
                            </tr>

                        )})}
                    </tbody>

                </table>
            </div>
        </div>
    );
}
export default RecentTickets;