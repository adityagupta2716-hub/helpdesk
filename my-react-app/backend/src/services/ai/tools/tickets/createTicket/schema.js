module.exports = {

    parameters:{

        type:"object",

        properties:{

            draft:{

                type:"object",

                description:
                "Optional ticket draft. If omitted, the active draft from the current session is used."

            }

        },

        required:[]

    },

    returns:{

        type:"object",

        properties:{

            ticketId:{
                type:"string"
            },

            title:{
                type:"string"
            },

            status:{
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

            createdAt:{
                type:"string"
            }

        }

    }

};