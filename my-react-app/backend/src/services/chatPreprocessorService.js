const normalizeText=(text)=>{
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s]/g,"");
};

const smallTalkResponses={
    "hi":
    "Hello! 👋 How can I help you today?",

    "hello":
    "Hello! 👋 How can I help you today?",

    "hey":
    "Hello! 👋 How can I help you today.",

    "good morning":
    "Good morning! ☀️ How can I assist you today?",

    "good afternoon":
    "Good afternoon! How can I help you today?",

    "good evening":
    "Good evening! How can I help you today?",

    "thanks":
    "You're welcome! Let me know if there's anything else I can help you with.",

    "thank you":
    "You're welcome! Happy to help.",

    "bye":
    "Goodbye! Have a great day.",

    "goodbye":
    "Goodbye! Feel free to come back if you need any assistance.",

    "who are you":
    "I'm your AI Campus Helpdesk Assistant. I can help with campus services, hostel, transport, IT support, library, accounts and other student support queries.",

    "what can you do":
    "I can answer campus-related questions, help troubleshoot common issues, assist with student services, and help you create support tickets when needed.",

    "help":
    "Sure! Tell me what campus-related issue or question you have, and I'll do my best to help.",

    "how are you":
    "I am doing well!, how can I help you today."
};

const detectSmallTalk=(message)=>{

    const normalized=normalizeText(message);
    
    if(smallTalkResponses[normalized])
    {
        return{
            isSmallTalk:true,
            response:smallTalkResponses[normalized]
        };
    }

    return{
        isSmallTalk:false,
        response:null
    };
};

module.exports={
    detectSmallTalk
};