import {Navigate} from "react-router-dom";
import {useSelector} from "react-redux";
function StaffRoute({children})
{
    const {user}=useSelector(state=>state.auth);
    return user?.role==="staff"
    ?children
    :<Navigate to="/access-denied" replace />
}
export default StaffRoute;