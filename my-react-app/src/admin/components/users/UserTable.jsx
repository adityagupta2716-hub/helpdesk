import StatusBadge from "../../../components/common/StatusBadge";
function UserTable({users,onDelete,onEdit})
{
    return(
        <div className="bg-white rounded-xl shadow p-6">
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr className="border-b">
                            <th className="text-left py-3">User ID</th>
                            <th className="text-left py-3">Name</th>
                            <th className="text-left py-3">Email</th>
                            <th className="text-left py-3">Role</th>
                            <th className="text-left py-3">Department</th>
                            <th className="text-left py-3">Status</th>
                            <th className="text-left py-3">Action</th>
                         </tr>
                    </thead>
                    <tbody>
                        {users.map(user=>(
                            <tr key={user._id} className="border-b">
                                <td className="py-3">{user._id.slice(-6)}</td>
                                <td className="py-3">{user.name}</td>
                                <td className="py-3">{user.email}</td>
                                <td className="py-3 capitalize">{user.role}</td>
                                <td className="py-3">{user.department || "-"}</td>
                                <td className="py-3"><StatusBadge status={user.status}/></td>
                                <td className="py-3">
                                    <button onClick={()=>{ onEdit(user) }} className="text-blue-600 hover:underline mr-3"> Edit</button>
                                <button onClick={()=>onDelete(user._id)} className="text-red-600 hover:underline">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
export default UserTable;