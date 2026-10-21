import { useNavigate } from "react-router-dom";
import TicketCard from "./components/TicketCard";
import TicketListCard from "./components/TicketListCard";
function ChatMessage({
    sender,
    text,
    confidence,
    suggestTicket,
    faq,
    ticketDraft,
    ui=[],
    role="student"
}){
    const navigate=useNavigate();
    const isUser=sender==="user";
    return(
        <div className={`flex ${isUser?"justify-end":"justify-start"}`}>
            <div className={`max-w-[75%] rounded-xl px-4 py-3 ${
                isUser?"bg-blue-600 text-white":"bg-gray-100 text-gray-800"
            }`}>
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold">
                        {isUser? "👨 You" : "🤖 AI Assistant"}
                    </span>
                </div>
                <p className="whitespace-pre-wrap">
                    {text}
                </p>
                {
                    !isUser &&
                    ui.map((component,index)=>{
                        switch(component.type)
                        {
                            case "ticket_card":
                                return (
                                    <TicketCard
                                    key={index}
                                    ticket={component.data}
                                    role={role}
                                    />
                                );

                            case "ticket_list":
                                return(
                                    <TicketListCard
                                    key={index}
                                    list={component.data}
                                    role={role}
                                    />
                                );
                            default:
                                return null;
                        }
                    })
                }
                {!isUser && faq && (
                    <div className="mt-3 border-t pt-2">
                        <div className="flex flex-wrap gap-2 mt-1">
                            <p className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                                {faq.category}
                            </p>
                            <p className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                                Knowledge Base
                            </p>
                        </div>
                    </div>
                )}

                {!isUser && confidence && (
                    <div className="mt-2">
                        <span
                        className={`text-xs px-2 py-1 rounded-full ${
                            confidence==="high"
                            ?"bg-green-100 text-green-700"
                            :confidence==="medium"
                            ?"bg-yellow-100 text-yellow-700"
                            :"bg-red-100 text-red-700"
                        }`}
                        >
                            {confidence.toUpperCase()} CONFIDENCE
                        </span>
                    </div>
                )}
                {!isUser && suggestTicket && ticketDraft && (
                    <div className="mt-4">
                        <button
                        onClick={()=>navigate("/student/create-ticket",
                            {
                                state:{ticketDraft}
                            }
                        )}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                            Create Ticket
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
export default ChatMessage;