import AdminLayout from "../components/layout/AdminLayout.jsx";
import Button from "../../components/common/Button.jsx";
import {useEffect, useState} from "react";
import KnowledgeBaseForm from "../components/knowledgeBase/KnowledgeBaseForm.jsx";
//import {
//    knowledgeBase as initialKnowledgeBase
//} from "../data/knowledgeBase.js";
import KnowledgeBaseAccordion from "../../components/common/KnowledgeBaseAccordion.jsx";
import Pagination from "../../components/common/Pagination.jsx";
import { useDispatch,useSelector } from "react-redux";
import { addFAQ, deleteFAQThunk, fetchFAQs, updateFAQThunk } from "../../features/knowledgeBase/knowledgeBaseSlice.js";
function AdminKnowledgeBase(){
    const dispatch=useDispatch();
    const {
        faqs,
        loading,
        error
    }=useSelector(state=>state.knowledgeBase);
    useEffect(()=>{
        dispatch(fetchFAQs());
    },[
        dispatch
    ]);
    const[searchTerm,setSearchTerm]=useState("");
    //const[faqs,setFaqs]=useState(initialKnowledgeBase);
    const filteredFaqs=faqs.filter(faq=>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.keywords?.some(keyword=>keyword.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const[showForm,setShowForm]=useState(false);
    const[editingFaq,setEditingFaq]=useState(null);


    const handleDelete=async(id)=>
    {
        const confirmDelete =
        window.confirm(
            "Are you sure you want to delete this FAQ?"
        );

        if(!confirmDelete)
        {
            return;
        }

        await dispatch(deleteFAQThunk(id));
    };
    const handleSaveFaq=async(data)=>
    {
        const formattedData={
            ...data,
            keywords:data.keywords.split(",").map(keyword=>keyword.trim()).filter(Boolean)
        }
        let result;
        if(editingFaq)
        {
            result=await dispatch(updateFAQThunk({
                faqId:editingFaq._id,
                faqData:formattedData
            }));
        }
        else{
            result=await dispatch(
                addFAQ(formattedData)
            );
        }
        if(result.type.endsWith("/fulfilled"))
        {
            dispatch(fetchFAQs());
            setShowForm(false);
            setEditingFaq(null);
        }
        console.log(result);
    };
    const[currentPage,setCurrentPage]=useState(1);
    const faqsPerPage=5;
    const totalPages = Math.ceil(
    filteredFaqs.length / faqsPerPage
    );

    const startIndex =
        (currentPage - 1) * faqsPerPage;

    const paginatedFaqs =
        filteredFaqs.slice(
            startIndex,
            startIndex + faqsPerPage
        );
    return(
        <AdminLayout >
            {
                showForm && (
                    <KnowledgeBaseForm 
                    initialData={editingFaq}
                    onCancel={()=>
                    {
                        setShowForm(false);
                        setEditingFaq(null);
                    }}
                    onSubmit={handleSaveFaq}
                    />
                )
            }
        <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
            Knowledge Base
        </h1>
        <Button text="+ Add FAQ"
        className="w-auto! px-6"
        onClick={()=>{
            setEditingFaq(null);
            setShowForm(true);
        }}
        />
        </div>
        <div className="bg-white rounded-xl shadow p-6 mb-6">
            <input type="text" placeholder="Search FAQs..." value={searchTerm}
            onChange={(e)=>{setSearchTerm(e.target.value);
                setCurrentPage(1);
            }} className="border rounded-lg p-3 w-full"/>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
            {paginatedFaqs.map(faq=>(
                <KnowledgeBaseAccordion
                key={faq._id}
                faq={faq}
                isAdmin={true}
                onEdit={(faq)=>{
                    setEditingFaq(faq);
                    setShowForm(true);
                }}
                onDelete={handleDelete}
                />
            ))}
        </div>
        <Pagination currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}/>
        </AdminLayout>

    );
}
export default AdminKnowledgeBase;