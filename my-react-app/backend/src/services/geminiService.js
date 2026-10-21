const model=require("./aiClient.js");
const generateResponse=async(
    userQuestion,
    topMatches,
    chatHistory=[]
)=>{
    const historyText=chatHistory.slice(0,6)
    .reverse().map(msg=>
        `${msg.sender}: ${msg.content}`
    ).join("\n");
    const retrievedContext=topMatches.map(
        (match,index)=>`
        FAQ ${index+1}
        
        Question:
        ${match.faq.question}
        
        Answer:
        ${match.faq.answer}
        
        Category:
        ${match.faq.category}
        `
    ).join("\n\n");
    const prompt=`
    You are an AI Campus Helpdesk Assistant.
    
    You must answer ONLY using the retrieved knowledge base entries below.

    Conversation History:

    ${historyText}

    Retrieved Knowledge Base:

    ${retrievedContext}

    Student Question:

    ${userQuestion}
    
    Instructions:

    - Use only information from the retrieved FAQs.
    - Combine information from multilple FAQs if relevant.
    - Do not invent policies, procedures, timings or rules.
    - If the retrieved FAQs do not fully answer the question, clearly say so.
    - Keep the answer professional and student friendly.
    - Do not mention FAQ numbers.
    `;

    try{
        const timeoutPromise=new Promise(
            (_,reject)=>setTimeout(()=>reject(
                new Error("Gemini Timeout")
            ),
            10000
        )
        );

        const result=await Promise.race([
            model.generateContent(prompt),timeoutPromise]);

        return result.response.text();
    }
    catch(error){
        console.error("[Gemini Fallback]: ",
            {
            question:userQuestion,
            error:error.message
        });
        return topMatches[0]?.faq?.answer ||
        "I couldn't generate a response right now. Please create aa support ticket.";
    }
};


module.exports={
    generateResponse
};