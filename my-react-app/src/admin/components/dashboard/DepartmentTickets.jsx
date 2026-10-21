//import {departmentTickets} from "../../data/departmentTickets.js";
function DepartmentTickets({departments=[]}){
    const maxCount=departments.length>0
    ?Math.max(...departments.map(department=>department.count))
    :1;
    return(
        <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-6">
                Department-wise Tickets
            </h2>
            <div className="space-y-4">
                {departments.length===0 && (
                    <p className="text-gray-500">
                        No department data available
                    </p>
                )}
                {departments.map((department)=>(
                    <div key={department.department}>
                        <div className="flex justify-between mb-1">
                            <span>
                                {department._id}
                            </span>
                            <span>
                                {department.count}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full"
                            style={{
                                width: `${
                                    (
                                        department.count /
                                        maxCount
                                    )* 100
                                }%`
                            }}/>
                                
                        </div>
                    </div>
                ))}
            </div>
        </div>

    );
}
export default DepartmentTickets;