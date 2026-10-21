import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
function AccessDenied(){
    const {user}=useSelector(state=>state.auth);
    const navigate=useNavigate();
    const  goToDashboard=()=>{
        if(user?.role==="admin")
        {
            navigate("/admin/dashboard");
        }
        else if(user?.role==="staff")
        {
            navigate("/staff/dashboard");
        }
        else{
            navigate("/student/dashboard");
        }
    };
    return(
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
                <h1 className="text-4xl font-bold text-red-600 mb-4">
                    403
                </h1>
                <h2 className="text-2xl font-semibold mb-2">
                    Access Denied
                </h2>
                <p className="text-gray-600 mb-6">
                    You do not have permission to access this page.
                </p>
                <button onClick={goToDashboard}
                className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg">
                    Go To Dashboard
                </button>
                
            </div>
        </div>
    );
}
export default AccessDenied;