module.exports={
    parameters:{
        type:"object",

        properties:{
            latestMessage:{
                type:"string",
                description:"The student's latest message."
            }
        },
        required:[
            "latestMessage"
        ]
    },
    
    returns:{
        type:"object",
        properties:{
            workflow:{
                type:"string"
            },
            ticketReady:{
                type:"boolean"
            },
            nextQuestion:{
                type:"object"
            },
            draft:{
                type:"object"
            }
        }
    }

};