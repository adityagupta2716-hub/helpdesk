import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import AssistantPanel from "../../components/assistant/AssistantPanel.jsx";

function AIAssistant(){
    
    return(
        <DashboardLayout>
            <h1 className="text-3xl font-bold">
                AI Assistant
            </h1>
            <p className="text-gray-500 mt-2">
                Ask me anything. I'm here to help.
            </p>
           <AssistantPanel role="student"/>
        </DashboardLayout>
    );
}
export default AIAssistant;