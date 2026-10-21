import {Navigate} from "react-router-dom";
import {useSelector} from "react-redux";
function ProtectedRoute({children})
{
    const {isAuthenticated}=useSelector(state=>state.auth);
    return isAuthenticated
    ?children
    :<Navigate to="/" replace/>;
}
export default ProtectedRoute;