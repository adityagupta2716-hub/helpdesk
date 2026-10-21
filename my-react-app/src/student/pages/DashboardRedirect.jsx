import { Navigate } from "react-router-dom";
import {useSelector} from "react-redux";
function DashboardRedirect(){
    const {user, isAuthenticated}=useSelector(state=>state.auth);
    if(!isAuthenticated || !user) return <Navigate to="/" replace />;
    const role=user.role;
    if(role==="admin") return <Navigate to="/admin/dashboard" replace />;
    if(role==="staff") return <Navigate to="/staff/dashboard" replace />;
    return <Navigate to="/student/dashboard" replace />;
}
export default DashboardRedirect;