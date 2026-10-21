import { current } from "@reduxjs/toolkit";

function Pagination({
    currentPage,
    totalPages,
    onPageChange
}){
    return(
        <div className="flex justify-end items-center gap-2 mt-6">
            <button disabled={currentPage===1}
            onClick={()=>onPageChange(currentPage-1)}
            className="px-3 py-2 border rounded-lg disabled:opacity-50"
            >
                Previous
            </button>
            {[...Array(totalPages)].map((_,index)=>(
                <button key={index}
                onClick={()=>onPageChange(index+1)}
                className={`px-3 py-2 rounded-lg ${
                    currentPage===index+1
                    ?"bg-blue-600 text-white"
                    :"border"
    
                }`}
                >
                    {index+1}
                </button>
            ))}
            <button
            disabled={currentPage===totalPages}
            onClick={()=>onPageChange(currentPage+1)}
            className="px-3 py-2 border rounded-lg disabled:opacity-50"
            >
                Next
            </button>
        </div>
    );
}
export default Pagination;