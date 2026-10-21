const KnowledgeBase=require("../models/KnowledgeBase.js");
const normalizeText=(text)=>{
    return text.toLowerCase().replace(/[^\w\s]/g,"").trim();
};
const stopWords=[
    "how",
    "what",
    "where", "is","are","the","a","an","to","do","i","my","when",
    "can","please"
];
const extractKeywords=(text)=>{
    return normalizeText(text).split(/\s+/).filter(word=>!stopWords.includes(word));
}
const synonyms = {
    password:["credential","credentials","passcode"],
    wifi:["internet","network"],
    internet:["wifi","network"],
    fee:["fees","payment","challan"],
    fees:["fee","payment","challan"],
    bus:["transport","route"],
    transport:["bus","route"],
    username:["login","userid","userid"],
    portal:["vtop","studentportal"],
    reset:["forgot","recover"],
    forgot:["reset","recover"],

    payment:["fees","fee","challan"],
    challan:["payment","fees"],

    hostel:["room","accommodation"],
    room:["hostel"],

    vtop:["portal","studentportal"],
    studentportal:["portal","vtop"],

    login:["signin","sign-in","signingin","signin-in"],
    signin:["login"],
};
const expandKeywords=(words)=>{
    const expanded=[...words];
    words.forEach(word=>{
        if(synonyms[word])
        {
            expanded.push(...synonyms[word]);
        }
    });
    return [...new Set(expanded)];
};
const createBigrams=(words)=>{
    const bigrams=[];
    for(let i=0;i<words.length-1;i++)
    {
        bigrams.push(`${words[i]} ${words[i+1]}`);
    }
    return bigrams;
}
const findBestFaq=async(userQuestion)=>{
    const faqs=await KnowledgeBase.find({
        isActive:true
    });
    const questionWords=expandKeywords(extractKeywords(userQuestion));
    const matches=[];
    const normalizedUserQuestion=normalizeText(userQuestion);
    for(const faq of faqs)
    {
        let score=0;
        const faqQuestion=normalizeText(faq.question);
        const faqCategory=normalizeText(faq.category);
        const faqKeywords=faq.keywords.map(keyword=>normalizeText(keyword));
        const questionPhrases=createBigrams(questionWords);
        questionPhrases.forEach(phrase=>{
            if(faqQuestion.includes(phrase))
            {
                score+=10;
            }
        
            faqKeywords.forEach(keyword=>{
                if(keyword.includes(phrase))
                {
                    score+=6;
                }
            });
        });
        if(faqQuestion===normalizedUserQuestion)
            {
                score+=20;
            }
        questionWords.forEach(word=>{
            if(faqQuestion.includes(word))
            {
                score+=5;
            }
            if(faqKeywords.includes(word))
            {
                score+=3;
            }
            if(faqCategory.includes(word))
            {
                score+=1;
            }
        });
        if(score>0)
        {
            matches.push({
                faq,
                score
            });
        }
    }
    matches.sort((a,b)=>b.score-a.score);
    const topMatches=matches.slice(0,3);
    if(topMatches.length===0 || topMatches[0].score<3)
    {
        return null;
    }
    return {
        topMatches,
        bestMatch:topMatches[0].faq,
        score:topMatches[0].score,
        confidence:
        topMatches[0].score>=20
        ?"high"
        :topMatches[0].score>=10
        ?"medium"
        :"low"
    };
};
module.exports={
    findBestFaq
};