
const {
    findBestFaq
}=require("../../../../chatbotService");

const ToolResult=require("../../../sdk/ToolResult.js");

const searchKnowledgeBase=async({
    query
})=>{
    const searchResult=await findBestFaq(query);

    if(!searchResult)
    {
        return ToolResult.success({
            summary:
            "No relevant knowledge base articles were found.",

            data:{
                found:false,
                topMatches:[],
                bestMatch:null,
                confidence:"none",
                score:0
            }
        });
    }
    return ToolResult.success({
        summary:
        `Knowledge base search completed. Confidence: ${searchResult.confidence}. ${searchResult.topMatches.length} article(s) matched the student's query.`,

        data:{
            found:true,
            confidence:searchResult.confidence,
            score:searchResult.score,
            bestMatch:{
                id:searchResult.bestMatch._id.toString(),
                question:searchResult.bestMatch.question,
                answer:searchResult.bestMatch.answer,
                category:searchResult.bestMatch.category
            },

            topMatches:
            searchResult.topMatches.map(match=>({
                id:match.faq._id.toString(),
                question:match.faq.question,
                answer:match.faq.answer,
                category:match.faq.category,
                score:match.score
            }))
            
        },
    });
};

module.exports={
    searchKnowledgeBase
};