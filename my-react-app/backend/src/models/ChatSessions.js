const mongoose=require("mongoose");
const chatSessionSchema=new mongoose.Schema(
    {
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        title:{
            type:String,
            default:"New Conversation"
        },

        activeDraft:{
            title:String,
            description:String,
            department:String,
            category:String,
            priority:String,

            confirmationPending:{
                type:Boolean,
                default:false
            },

            confirmedAt:{
                type: Date,
                default:null
            },

            createdTicketId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Ticket",
                default:null
            },

            preparation:{
                pendingQuestion:{
                    field:{
                        type:String,
                        default:null
                    },

                    question:{
                        type:String,
                        default:null
                    },

                    reason:{
                        type:String,
                        default:null
                    }
                    
                },

                missingFields:[
                    {
                        field:{
                            type:String
                        },
                        reason:{
                            type:String
                        }
                    }
                ],
                ticketReady:{
                    type:Boolean,
                    default:false
                },
                lastUpdatedAt:{
                    type: Date,
                    default: null
                }
            },
            context:{
                type:mongoose.Schema.Types.Mixed,
                default:{}
            }

        },

        draftStatus:{
            type:String,
            enum:[
                "active",
                "completed"
            ],
            default:null
        }
    },
    {
        timestamps:true
    }
);

module.exports=mongoose.model(
    "ChatSession",
    chatSessionSchema
);