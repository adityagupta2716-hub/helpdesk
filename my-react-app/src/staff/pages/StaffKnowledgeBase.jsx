import StaffLayout from "../components/layout/StaffLayout.jsx";
import {useEffect, useState} from "react";
//import { staffKnowledgeBase } from "../data/staffKnowledgeBase.js";
import KnowledgeBaseAccordion from "../../components/common/KnowledgeBaseAccordion.jsx";
import { useDispatch,useSelector } from "react-redux";
import { fetchFAQs } from "../../features/knowledgeBase/knowledgeBaseSlice.js";
import Pagination from "../../components/common/Pagination.jsx";
function StaffKnowledgeBase(){
    const dispatch=useDispatch();
    const{
        faqs,
        loading,
        error
    }=useSelector(state=>state.knowledgeBase);
    useEffect(()=>{
        dispatch(fetchFAQs());
    },[
        dispatch
    ]);
    const{
        departments
    }=useSelector(state=>state.departments);
    const[searchTerm,setSearchTerm]=useState("");
    const[selectedCategory,setSelectedCategory]=useState("All");
    const[currentPage,setCurrentPage]=useState(1);
    const articlesPerPage=5;

    const filteredArticles=faqs.filter(article=>{
    const matchesSearch = article.question.toLowerCase().includes(searchTerm.toLowerCase())
    ||
    article.answer.toLowerCase().includes(searchTerm.toLowerCase())
    ||
    article.keywords?.some(keyword=>keyword.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory==="All"||
    article.category===selectedCategory;

    return matchesSearch && matchesCategory;
    });
    
    const categories=[
        { name: "All", count: faqs.length },
        ...departments.map(department=>({
            name:department.name,
            count:faqs.filter(faq=>
                faq.category===department.name
            ).length
        }))
    ];

    const totalPages=Math.ceil(filteredArticles.length/articlesPerPage);
    const startIndex=(currentPage-1)*articlesPerPage;
    const paginatedArticles=filteredArticles.slice(startIndex,startIndex+articlesPerPage);

    if(loading)
    {
        return(
            <StaffLayout>
                Loading FAQS...
            </StaffLayout>
        );
    }
    if(error)
    {
        return(
            <StaffLayout>
                {error}
            </StaffLayout>
        );
    }
    return(
        <StaffLayout>
            <h1 className="text-3xl font-bold">
                Knowledge Base
            </h1>
            <div className="bg-white rounded-xl shadow p-6 mt-6">
                <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e)=>{
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                }}
                className="w-full border rounded-lg p-3" />
            </div>
            <div className="bg-white rounded-xl shadow p-6 mt-6">
                <h2 className="text-xl font-semibold mb-6">
                    Popular Articles
                </h2>
                {paginatedArticles.map(article=>(
                    <KnowledgeBaseAccordion
                    key={article._id}
                    faq={article}
                    />
                ))}
            </div>
            {
                totalPages>1 && (
                <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                />
            )}
            <div className="bg-white rounded-xl shadow p-6 mt-6">
                <h2 className="text-xl font-semibold mb-4">
                    Browse by Category
                </h2>
                <div className="flex flex-wrap gap-3">
                    {categories.map(category=>(
                        <button
                        key={category.name}
                        onClick={()=>{
                            setSelectedCategory(category.name);
                            setCurrentPage(1);
                        }}
                        className={`px-4 py-2 rounded-lg border transition ${
                            selectedCategory===category.name
                            ?"bg-blue-600 text-white"
                            :"bg-gray-50 hover:bg-gray-100"
                        }`}
                        >
                            {category.name}
                            <span className="ml-2 text-gray-500">
                                {category.count}
                            </span>
                        </button>

                    ))}
                </div>
                <p className="text-gray-500 mt-6">
                    Can't find what you're looking for?
                    Please create or update a ticket and contact the relevant department.
                </p>
            </div>
        </StaffLayout>

    );
}
export default StaffKnowledgeBase;