module.exports={
    parameters:{
        type:"object",
        properties:{
            message:{
                type:"string",
                description:"The student's current message."
            },

            chatHistory:{
                type:"array",
                description:"Recent conversation History.",
                items:{
                    type:"object"
                }
            }
        },

        required:[
            "message"
        ]
    },

    returns:{
        type:"object",
        properties:{
            intent:{
                type:"string"
            },
            department:{
                type:"string"
            },
            category:{
                type:"string"
            },
            priority:{
                type:"string"
            },
            title:{
                type:"string"
            },
            description:{
                type:"string"
            },
            draftAction:{
                type:"string"
            },
            needsMoreInfo:{
                type:"boolean"
            }
        }
    }
};