import { Navigate } from "react-router-dom";
import {useSelector} from "react-redux";

function StudentRoute({children}) 
{
  const {user}=useSelector(state=>state.auth);
  return user?.role==="student"
  ?children
  :<Navigate to="/access-denied" replace />
}

export default StudentRoute;