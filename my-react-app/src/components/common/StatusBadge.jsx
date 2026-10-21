function StatusBadge({status}){
    const styles={
        Open: "bg-green-100 text-green-700",
        "In Progress":"bg-yellow-100 text-yellow-700",
        Resolved: "bg-blue-100 text-blue-700",
        "Pending Review":"bg-purple-100 text-purple-700",
        Closed:"bg-gray-100 text-gray-700",
        Canceled:"bg-gray-200 text-gray-800",
        active:"bg-green-100 text-green-700",
        Active:"bg-green-100 text-green-700",
        Inactive: "bg-gray-100 text-gray-700"
    };
    return(
        <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium ${styles[status]|| "bg-gray-100 text-gray-700"}`}>
            {status}
        </span>
    );
}
export default StatusBadge;