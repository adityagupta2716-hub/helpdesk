import {useState} from "react";
function KnowledgeBaseAccordion({
    faq,
    isAdmin=false,
    onEdit,
    onDelete
})
{
    const[isOpen,setIsOpen]=useState(false);
    return(
        <div className="border rounded-xl mb-4 overflow-hidden">
            <button 
            onClick={()=>setIsOpen(!isOpen)}
            className="w-full text-left p-4 flex justify-between items-center">
                <div>
                    <h3 className="font-semibold">
                        {faq.question}
                    </h3>
                    <p className="text-sm text-gray-500">
                        {faq.category}
                    </p>
                </div>
                <span>
                    {isOpen?"-":"+"}
                </span>
            </button>
            {isOpen && (
                <div className="border-t p-4">
                    <p className="text-gray-700">
                        {faq.answer}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                        {faq.keywords?.map(keyword=>(
                            <span key={keyword} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                                {keyword}
                            </span>
                        ))}
                    </div>
                    {isAdmin && (
                        <div className="flex gap-3 mt-4">
                            <button 
                            onClick={()=>onEdit(faq)}
                            className="text-blue-600"
                            >
                                Edit
                            </button>
                            <button 
                            onClick={()=>onDelete(faq._id)}
                            className="text-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
export default KnowledgeBaseAccordion;