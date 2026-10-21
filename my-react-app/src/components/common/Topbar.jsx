import {FaBell} from "react-icons/fa";
import {Link} from "react-router-dom";
function Topbar({
    role,
    userName,
    userRole
})
{
    const notificationPath=`/${role}/notifications`;
    const profilePath=`/${role}/profile`;
    return(
        <div className="bg-white rounded-xl shadow px-6 py-4 flex justify-end items-center gap-4 mb-6">
            <Link to={notificationPath}>
            <FaBell className="text-gray-600 text-lg cursor-pointer"/>
            </Link>
            <div className="flex items-center gap-3">
                <Link to={profilePath}>
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                    {userName?.charAt(0) ?? "?"}
                </div>
                </Link>
                <div>
                    <p className="font-semibold">
                        {userName}
                    </p>
                    <p className="text-sm text-gray-500 capitalize">
                        {userRole}
                    </p>
                </div>
            </div>
        </div>
    );
}
export default Topbar;