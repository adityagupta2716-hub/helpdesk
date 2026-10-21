import { useNavigate } from "react-router-dom";
function HelpCard()
{
    const navigate=useNavigate();
    return(
        <div className="bg-white rounded-xl shadow p-6 mt-6">
            <h2 className="text-xl font-semibold mb-3">
                Need Help?
            </h2>
            <p className="text-gray-600 mb-4">
                Visit the FAQ section or contact support for assistance.
            </p>
            <button 
            onClick={()=>navigate("/student/knowledge-base")}
            className="w-full bg-gray-100 hover:bg-gray-200 rounded-lg py-3 transition">
                Open FAQ
            </button>
        </div>
    );
}
export default HelpCard;