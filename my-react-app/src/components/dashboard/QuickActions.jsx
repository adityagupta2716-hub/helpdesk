import Button from "../common/Button.jsx";
import {Link} from "react-router-dom";
import { useState } from "react";
import ContactSupportModal from "../common/modals/ContactSupportModal.jsx";
function QuickActions(){
    const [showSupportModal,setShowSupportModal]=useState(false);
    return(
        <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="flex flex-col gap-3">
                <Link to="/student/create-ticket">
                <Button type="submit" text="Create Ticket"/>
                </Link>
                <Link to="/student/assistant">
                <Button type="submit" text="AI Assistant"/>
                </Link>
                <button 
                onClick={()=>setShowSupportModal(true)}
                className="w-full border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition">
                    Contact Support
                </button>
            </div>
            {
                showSupportModal && (
                    <ContactSupportModal
                    onClose={()=>
                        setShowSupportModal(false)
                    }
                    />
                )
            }
        </div>
    );
}
export default QuickActions;