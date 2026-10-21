import {Navigate} from "react-router-dom";
import {useSelector} from "react-redux";
function AdminRoute({children})
{
    const {user}=useSelector(state=>state.auth);
    return user?.role==="admin"
    ?children
    :<Navigate to="/access-denied" replace />;
}
export default AdminRoute;