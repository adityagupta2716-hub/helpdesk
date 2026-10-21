function PopularQuestions({
    onQuestionClick,
    role="student"
})
{
    const studentQuestions=[
        "I forgot my password",
        "How do I change my username?",
        "How do I generate a challan?",
        "How do I check my bus route?",
        "I cannot access my student portal"
    ];

    const adminInsights=[
        {
            title:"📊 Tickets Opened Today",
            prompt:"How many tickets were opened today?"
        },
        {
            title:"🚨 High Priority Tickets",
            prompt:"Show me all high priority tickets."
        },
        {
            title:"🏢 Department Workload",
            prompt:"Which department currently has the highest workload?"
        },
        {
            title:"📝 Daily Incident Summary",
            prompt:"Generate a summary of today's incidents."
        },
        {
            title:"📈 Ticket Trends",
            prompt:"What are the current ticket trends?"
        },
        {
            title:"📂 View All Tickets",
            prompt:"Show me all tickets."
        }
    ];

    return(
        <div className="bg-white rounded-xl shadow p-6">

            <h2 className="font-semibold text-lg mb-4">
                {role==="admin"
                    ? "AI Insights"
                    : "Popular Questions"}
            </h2>

            <div className="space-y-3">

                {
                    role==="student"

                    ?

                    studentQuestions.map((question,index)=>(
                        <button
                            key={index}
                            onClick={()=>onQuestionClick(question)}
                            className="w-full text-left border rounded-lg p-3 hover:bg-gray-50 transition"
                        >
                            {question}
                        </button>
                    ))

                    :

                    adminInsights.map((item,index)=>(
                        <button
                            key={index}
                            onClick={()=>onQuestionClick(item.prompt)}
                            className="w-full text-left border rounded-lg p-3 hover:bg-blue-50 transition"
                        >
                            {item.title}
                        </button>
                    ))
                }

            </div>

        </div>
    );
}

export default PopularQuestions;