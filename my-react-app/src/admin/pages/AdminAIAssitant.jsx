import AdminLayout from "../components/layout/AdminLayout";
import AssistantPanel from "../../components/assistant/AssistantPanel";

function AdminAIAssistant()
{
    return(
        <AdminLayout>
            <h1 className="text-3xl font-bold">
                AI Assistant
            </h1>

            <p className="text-gray-500 mt-2">
                Ask questions about tickets, departments, users and campus operations.
            </p>
            <AssistantPanel role="admin"/>


            
        </AdminLayout>
    );
}

export default AdminAIAssistant;