import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import {useState} from "react";
import TicketTable from "../../components/tickets/TicketTable.jsx";
import { Link } from "react-router-dom";
import {FaPlusCircle} from "react-icons/fa";
import Pagination from "../../components/common/Pagination.jsx";
import { useEffect } from "react";
import {
    useDispatch,
    useSelector
} from "react-redux";
import {
    fetchMyTickets
} from "../../features/tickets/ticketSlice.js";
function MyTickets(){
    const dispatch=useDispatch();
    const {
        tickets,
        loading,
        error
    }=useSelector(state=>state.tickets);
    console.log(tickets);
    useEffect(()=>{
        dispatch(fetchMyTickets());
    },[
        dispatch
    ]);
    const[activeTab,setActiveTab]=useState("All");

    const[currentPage,setCurrentPage]=useState(1);
    const ticketsPerPage=5;

    const tabs=[
        "All",
        "Open",
        "In Progress",
        "Resolved",
        "Closed"
    ];
    const filteredTickets= 
    activeTab==="All"
    ?tickets
    :tickets.filter(
        (ticket)=>ticket.status===activeTab);

    const totalPages=Math.ceil(filteredTickets.length/ticketsPerPage);
    const startIndex=(currentPage-1)*ticketsPerPage;
    const paginatedTickets=filteredTickets.slice(startIndex,startIndex+ticketsPerPage);

    return (
        <DashboardLayout>
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">
                        My Tickets
                    </h1>
                    <p className="text-gray-600 mt-2">
                        View and track all your submitted tickets.
                    </p>
                </div>
                <Link
                to="/student/create-ticket"
                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition">
                    <FaPlusCircle size={14} className="mt-0.5"/>
                    Create Ticket
                </Link>
            </div>
            <div className="flex gap-4 mt-8">
                {tabs.map((tab)=>(
                    <button
                    key={tab}
                    onClick={()=>{setActiveTab(tab),setCurrentPage(1)}}
                    className={`px-5 py-2 rounded-lg whitespace-nowrap transition ${activeTab===tab?
                    "bg-blue-600 text-white":"bg-white hover:bg-gray-100"}`}>
                        {tab}
                    </button>



                ))}
            </div>
            <p className="mt-4 text-gray-600">
                 Showing {filteredTickets.length} tickets
             </p>
             <div className="bg-white rounded-xl shadow p-6 mt-6">
                <TicketTable tickets={paginatedTickets}/>
                {
                    totalPages>1 && (
                    <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    />
                )}
            </div>

        </DashboardLayout>
    );
}
export default MyTickets;