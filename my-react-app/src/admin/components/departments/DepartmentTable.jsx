import StatusBadge from "../../../components/common/StatusBadge";
function DepartmentTable({departments,onDelete,onEdit})
{
    return(
        <div className="bg-white rounded-xl shadow p-6">
            <div className="overflow-x-auto">

                <table className="min-w-full">

                    <thead>
                        <tr className="border-b">
                            <th className="text-left py-3">
                                Department ID
                            </th>

                            <th className="text-left py-3">
                                Department Name
                            </th>

                            <th className="text-left py-3">
                                Description
                            </th>

                            <th className="text-left py-3">
                                Status
                            </th>

                            <th className="text-left py-3">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody>

                        {departments.map(department=>(
                            <tr
                                key={department._id}
                                className="border-b"
                            >

                                <td className="py-3">
                                    {department._id.slice(-6)}
                                </td>

                                <td className="py-3">
                                    {department.name}
                                </td>

                                <td className="py-3">
                                    {department.description}
                                </td>

                                <td className="py-3">
                                    <StatusBadge
                                        status={department.isActive?"Active":"Inactive"}

                                    />
                                </td>

                                <td className="py-3">
                                    <button
                                    onClick={()=>onEdit(department)}
                                        className="text-blue-600 hover:underline mr-3"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={()=>
                                            onDelete(department._id)
                                        }
                                        className="text-red-600 hover:underline"
                                    >
                                        Delete
                                    </button>
                                </td>

                            </tr>
                        ))}

                    </tbody>

                </table>

            </div>
        </div>
    );
}

export default DepartmentTable;