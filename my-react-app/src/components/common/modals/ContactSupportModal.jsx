import { useNavigate } from "react-router-dom";
function ContactSupportModal({onClose})
{
    const navigate=useNavigate();
    return(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">
                        Contact Support
                    </h2>
                    <button 
                    onClick={onClose}
                    className="text-gray-500 text-xl"
                    >
                        X
                    </button>
                </div>
                <div className="space-y-4">
                    <div>
                        <p className="font-semibold">
                            Email Support
                        </p>
                        <p className="text-gray-600">
                            support@campushelpdesk.com
                        </p>
                    </div>
                    <div>
                        <p className="font-semibold">
                            Phone Support
                        </p>
                        <p className="text-gray-600">
                            +91 9876543210
                        </p>
                    </div>
                    <div>
                        <p className="font-semibold">
                            Office Location
                        </p>
                        <p className="text-gray-600">
                            Student Services Block,
                            Ground Floor
                        </p>
                    </div>
                    <div>
                        <p className="font-semibold">
                            Working Hours
                        </p>
                        <p className="text-gray-600">
                            Monday - Friday
                            <br />
                            9:00 AM - 5:00 PM
                        </p>
                    </div>
                </div>
                <div className="flex gap-3 mt-6">
                    <button 
                    onClick={()=>{
                        navigate("/student/create-ticket");
                        onClose();
                    }}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
                        Create Ticket
                    </button>
                    <button 
                    onClick={onClose}
                    className="w-full bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
export default ContactSupportModal;