import AdminLayout from "../components/layout/AdminLayout.jsx";
//import {adminTickets} from "../data/adminTickets.js";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import PriorityBadge from "../../components/common/PriorityBadge.jsx";
import {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import { TICKET_STATUS } from "../../constants/ticketStatus.js";
import { DEPARTMENTS } from "../../constants/departments.js";
import { PRIORITIES } from "../../constants/priorities.js";
import Pagination from "../../components/common/Pagination.jsx";
import{
    useDispatch,
    useSelector
} from "react-redux";
import { fetchAllTickets } from "../../features/tickets/ticketSlice.js";
import { fetchStaffUsers } from "../../features/users/userSlice.js";
function AdminTickets(){
    const dispatch=useDispatch();
    const {
        staffUsers
    }=useSelector(state=>state.users)
    useEffect(()=>{
        dispatch(fetchStaffUsers());
    },[
        dispatch
    ]);
    console.log(staffUsers);
    const{
        tickets,
        loading,
        error
    }=useSelector(state=>state.tickets);
    useEffect(()=>{
        dispatch(fetchAllTickets());
    },[
        dispatch
    ]);
    const[searchTerm,setSearchTerm]=useState("");
    const[statusFilter,setStatusFilter]=useState("");
    const[departmentFilter,setDepartmentFilter]=useState("");
    const[priorityFilter,setPriorityFilter]=useState("");
    const filteredTickets=tickets.filter(ticket=>
    {
        const matchesSearch=
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase())
        || ticket._id.toLowerCase().includes(searchTerm.toLowerCase())
        || ticket.createdBy?.name.toLowerCase().includes(searchTerm.toLowerCase())
        || ticket.department.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus=
        !statusFilter||ticket.status===statusFilter;
        const matchesDepartment=
        !departmentFilter||ticket.department===departmentFilter;
        const matchesPriority=
        !priorityFilter||ticket.priority===priorityFilter;
        if(loading)
        {
            return(
                <AdminLayout>
                    Loading Tickets...
                </AdminLayout>
            );
        }

        if(error)
        {
            return(
                <AdminLayout>
                    {error}
                </AdminLayout>
            );
        }
        return (
            matchesSearch &&
            matchesStatus &&
            matchesDepartment &&
            matchesPriority
        );
    }
    );
    const statusOptions=Object.values(TICKET_STATUS);
    const departmentOptions=Object.values(DEPARTMENTS);
    const priorityOptions=Object.values(PRIORITIES);
    const[currentPage,setCurrentPage]=useState(1);
    const ticketsPerPage=5;
    const totalPages=Math.ceil(filteredTickets.length/ticketsPerPage);
    const startIndex=(currentPage-1)*ticketsPerPage;
    const paginatedTickets=filteredTickets.slice(
        startIndex,
        startIndex+ticketsPerPage
    );
    return(
        
        <AdminLayout >
            <h1 className="text-3xl font-bold">
                Tickets
            </h1>
            <div className="bg-white rounded-xl shadow p-6 mt-6">
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <input 
                    type="text"
                    placeholder="Search Tickets..."
                    value={searchTerm}
                    onChange={(e)=>{setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="border rounded-lg p-3"
                    />
                    <select
                    value={statusFilter}
                    onChange={(e)=>{setStatusFilter(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="border rounded-lg p-3"
                    >
                        <option value="">All Status</option>
                        {statusOptions.map(status=>(
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                        ))}
                    </select>
                    <select value={departmentFilter}
                    onChange={(e)=>{setDepartmentFilter(e.target.value);
                        setCurrentPage(1);}
                    }
                    className="border rounded-lg p-3">
                        <option value="">All Departments</option>
                        {departmentOptions.map(status=>(
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                    </select>
                    <select value={priorityFilter}
                    onChange={(e)=>{setPriorityFilter(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="border rounded-lg p-3">
                        <option value="">All Priorities</option>
                        {priorityOptions.map(status=>(
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                    </select>
                </div>
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr className="border-b">
                            <th className="text-left py-3">Ticket ID</th>
                            <th className="text-left py-3">Title</th>
                            <th className="text-left py-3">User</th>
                            <th className="text-left py-3">Department</th>
                            <th className="text-left py-3">Status</th>
                            <th className="text-left py-3">Priority</th>
                            <th className="text-left py-3">Assigned To</th>
                            <th className="text-left py-3">Created On</th>
                            <th className="text-left py-3">Action</th>
                         </tr>
                    </thead>
                    <tbody>
                        {paginatedTickets.map(ticket=>(
                            <tr key={ticket._id} className="border-b">
                                <td className="py-3">{ticket._id.slice(-6)}</td>
                                <td className="py-3">{ticket.title}</td>
                                <td className="py-3">{ticket.createdBy?.name}</td>
                                <td className="py-3">{ticket.department}</td>
                                <td className="py-3"><StatusBadge status={ticket.status}/></td>
                                <td className="py-3"><PriorityBadge priority={ticket.priority}/></td>
                                <td className="py-3">{ticket.assignedTo?"Assigned":"Unassigned"}</td>
                                <td className="py-3">{new Date(ticket.createdAt).toLocaleDateString()}</td>
                                <td className="py-3"><Link to={`/admin/tickets/${ticket._id}`} className="text-blue-600 hover:underline">
                                    View</Link></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            />
            </div>
            
            

        
        </AdminLayout>

    );
}
export default AdminTickets;