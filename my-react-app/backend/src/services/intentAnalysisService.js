const model=require("./aiClient.js");
const analyzeIntent=async(userMessage,chatHistory=[])=>{
    try{
        const historyText=chatHistory.slice(0,6).reverse().map(msg=>
            `${msg.sender}: ${msg.content}`
        ).join("\n");
        const prompt=`
        You are an AI Campus Helpdesk Intent Classifier.
        
        Your job is to classify student messages.
        
        Possible intents:
        
        1. question
        - Asking for information
        - Asking how to do something
        - Asking procedures
        
        Examples:
        - How do I reset my password?
        - How do I change my Username?
        - How do I generate a challan?
        - How do I gain attendance back with a health certificate?
        
        2. issue
        - Reporting a problem
        - Reporting something broken
        - Unable to access a service
        - Needs support staff intervention
        
        Examples:
        - Wifi not working
        - Cannot login to VTOP
        - Hostel room AC leaking
        - Bus route not showing
        
        3. out_of_scope
        Any question unrelated to:
        - Campus services
        - Student support
        - Hostel
        - Transport
        - Accounts
        - Administration
        - Library
        - IT Support
        - Maintenance

        MUST be classified as out_of_scope.
        
        Examples:
        - Iran vs America war
        - Russia Ukraine war
        - Who won IPL
        - Teach me React
        - Java interview questions
        - Best gaming laptop
        - Stock market news
        - How to lose weight

        4. informational
        - User is asking for factual information regarding the campus
        - Not reporting an issue
        - Not requesting support staff intervention
        - Not asking a procedural "how-to"

        Examples:
        - Where is the library?
        - What are the library timings?
        - What is hostel curfew time?
        - Where is the transort office?
        - What are the office hours?
        
        Allowed Departments:
        IT Support
        Administration
        Accounts
        Library
        Hostel
        Transport
        Maintenance
        
        Allowed Categories:
        Network
        Software
        Academic
        Hostel
        Transport
        Accounts
        Library
        Maintenance
        Administration
        
        Allowed Priorities:
        Low
        Medium
        High
        
        If the message is unclear, set:
        
        "needsMoreInfo":true
        
        Return ONLY valid JSON.
        JSON Rules:
        If intent="question"
        Return:
        {
            "intent":"question",
            "draftAction":"ignore",
            "department":null,
            "category":null,
            "priority":null,
            "title":null,
            "description":null,
            "needsMoreInfo":false,
            "reason":null
        }

        If intent="out_of_scope"
        Return:
        {
            "intent":"out_of_scope",
            "department":null,
            "category":null,
            "priority":null,
            "title":null,
            "description":null,
            "needsMoreInfo":false,
            "reason":"Not related to campus support"
        }
        
        If intent="informational"
        Return:
        {
            "intent":"informational",
            "draftAction":"ignore",
            "department":null,
            "category":null,
            "priority":null,
            "title":null,
            "description":null,
            "needsMoreInfo":false,
            "reason":null
        }

        Only when intent="issue"
        should department/category/priority/title/desciption be populated.

        If you are not at least 80% confident whether the message is
        question, informational, issue, or out_of_scope:
        {
            "intent":"needs_review",
            "department":null,
            "category":null,
            "priority":null,
            "title":null,
            "description":null,
            "needsMoreInfo":true,
            "reason":"Ambiguous user request"
        }
        

        Few examples:
        Student:
        How do I reset my password?

        Output:
        {
        "intent":"question",
        "draftAction":"ignore",
        "department":null,
        "category":null,
        "priority":null,
        "title":null,
        "description":null,
        "needsMoreInfo":false,
        "reason":null
        }

        Student:
        Hostel wifi not working since yesterday

        Output:
        {
        "intent":"issue",
        "draftAction":"new",
        "department":"IT Support",
        "category":"Network",
        "priority":"Medium",
        "title":"Hostel wifi not working",
        "description":"Hostel wifi not working since yesterday",
        "needsMoreInfo":false,
        "reason":null
        }

        Student:
        Russia Ukraine war

        Output:
        {
        "intent":"out_of_scope",
        "department":null,
        "category":null,
        "priority":null,
        "title":null,
        "description":null,
        "needsMoreInfo":false,
        "reason":"Not related to campus support"
        }

        Important:
        If there are previous messages available,
        determine whether the user is:
        1. Creating a new issue
        2. Providing additional details for an existing issue
        3. Asking a completely unrelated question
        Return:
        "draftAction":"new"
        or
        "draftAction":"update"
        or
        "draftAction":"ignore"

        EXAMPLE OF A CONVERSATION HISTORY:
        user: hostel wifi not working

        assistant: ticket draft created

        Current Message:

        it is in A block

        Output:

        {
        "intent":"issue",
        "draftAction":"update",
        "department":"IT Support",
        "category":"Network",
        "priority":"Medium",
        "title":"Hostel WiFi not working",
        "description":"Hostel WiFi not working in A block",
        "needsMoreInfo":false,
        "reason":null
        }

        EXAMPLE OF A CONVERSATION HISTORY:
        user: hostel wifi not working

        assistant: ticket draft created

        Current Message:

        thanks

        Output:

        {
        "intent":"question",
        "draftAction":"ignore",
        "department":null,
        "category":null,
        "priority":null,
        "title":null,
        "description":null,
        "needsMoreInfo":false,
        "reason":null
        }

        
        Conversation History:
        ${historyText}

        Current Student Message:
        ${userMessage}
        `;

        const lower=userMessage.toLowerCase();
        const issueIndicators=[
            "not working",
            "unable",
            "can't",
            "error",
            "issue",
            "problem",
            "failed",
            "leaking",
        ];
        const result=await model.generateContent(prompt);
        const responseText=result.response.text();
        const cleaned=responseText.replace(/```json/g,"")
        .replace(/```/g,"").trim();
        const VALID_INTENTS=[
            "question",
            "issue",
            "informational",
            "out_of_scope",
            "needs_review"
        ];
        const VALID_DEPARTMENTS=[
            "IT Support",
            "Administration",
            "Accounts",
            "Library",
            "Hostel",
            "Transport",
            "Maintenance"
        ];
        const VALID_CATEGORIES = [
            "Network",
            "Software",
            "Academic",
            "Hostel",
            "Transport",
            "Accounts",
            "Library",
            "Maintenance",
            "Administration"
        ];
        const VALID_PRIORITIES = [
            "Low",
            "Medium",
            "High"
        ];
        const VALID_DRAFT_ACTIONS=[
            "new",
            "update",
            "ignore"
        ];

        const parsed=JSON.parse(cleaned);
        if(!VALID_DRAFT_ACTIONS.includes(parsed.draftAction))
        {
            parsed.draftAction="ignore";
        }
        if(!VALID_INTENTS.includes(parsed.intent))
        {
            throw new Error("Invalid intent");
        }
        if(parsed.department && !VALID_DEPARTMENTS.includes(parsed.department))
        {
            parsed.department=null;
        }
        if(parsed.category && !VALID_CATEGORIES.includes(parsed.category))
        {
            parsed.category=null;
        }
        if(parsed.priority && !VALID_PRIORITIES.includes(parsed.priority))
        {
            parsed.priority="Medium";
        }
        if(parsed.intent!=="issue" && parsed.intent!=="needs_review")
        {
            parsed.department=null;
            parsed.category=null;
            parsed.priority=null;
            parsed.title=null;
            parsed.description=null;
        }
        return parsed;

    }
    catch(error)
    {
        console.error("[Intent Analysis Error]",error.message);
        const lower=userMessage.toLowerCase();
        const issueKeywords=[
            "not working",
            "unable",
            "can't",
            "cannot",
            "error",
            "issue",
            "problem",
            "failed",
            "failure",
            "leaking",
            "broken",
            "crashed",
            "down"
        ];
        const isIssue=issueKeywords.some(
            keyword=>lower.includes(keyword)
        );
        if(isIssue)
        {
            let department="Administration";
            let category="Academic";
            if(
                lower.includes("wifi") ||
                lower.includes("internet") ||
                lower.includes("network")
             )
             {
                department="IT Support";
                category="Network";
             }
             else if(
                lower.includes("vtop") ||
                lower.includes("password") ||
                lower.includes("login") ||
                lower.includes("portal") ||
                lower.includes("software")
             )
             {
                department="IT Support";
                category="Software";
             }
             else if(
                lower.includes("hostel")||
                lower.includes("room")
             )
             {
                department="Hostel";
                category="Hostel";
             }
             else if(
                lower.includes("ac") ||
                lower.includes("electricity") ||
                lower.includes("water") ||
                lower.includes("fan") ||
                lower.includes("maintenance")
            )
            {
                department="Maintenance";
                category="Maintenance";
            }

            else if(
                lower.includes("bus") ||
                lower.includes("transport")
            )
            {
                department="Transport";
                category="Transport";
            }
            return{
            intent:"issue",
            draftAction:"new",
            department,
            category,
            priority:"Medium",
            title:userMessage,
            description:userMessage,
            needsMoreInfo:false,
            reason:"Local fallback classifier"
            };
        }
        return{
            intent:"question",
            draftAction:"ignore",
            department:null,
            category:null,
            priority:null,
            title:null,
            description:null,
            needsMoreInfo:false,
            reason:"Local fallback classifier"
        };
        
    }
        
    
};
module.exports={
    analyzeIntent
};