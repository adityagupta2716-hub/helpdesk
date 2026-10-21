module.exports={
    parameters:{
        type: "object",

        properties:{
            query:{
                type:"string",
                description:"Student's question to search in the knowledge base."
            }
        },
        required:[
            "query"
        ]
    },
    returns :{
        type:"object",
        
        properties:{
            found:{
                type:"boolean"
            },
            confidence:{
                type:"string"
            },
            score:{
                type:"number"
            },
            bestMatch:{
                type:"object"
            },
            topMatches:{
                type:"array"
            }
        }
    }
};