const Ticket=require("../models/Ticket.js");
const User=require("../models/User.js");
const Notification=require("../models/Notification.js");
const TicketTimeline=require("../models/TicketTimeline.js");
const TicketService=require("../services/ticket/TicketService.js");
const NotificationService=require("../services/notification/NotificationService.js");
const TicketRealtimeService=require("../services/realtime/TicketRealtimeService.js");
const createTicket=async(req,res)=>{
    try{
        const{
            title,
            description,
            department,
            category,
            priority,
            status
        }=req.body
        const allowedStatuses=[
            "Open",
            "Resolved"
        ];
        const finalStatus=allowedStatuses.includes(status)
        ?status:"Open";
        const ticket=await TicketService.createTicket({
            title,
            description,
            department,
            category,
            priority,
            createdBy:req.user._id,
            createdByName:req.user.name
        });

        await NotificationService.notify({
            event:"ticket.created.student",
            userId:ticket.createdBy,
            payload:{
                ticket,
                actor:req.user
            }
        });

        const admins=await User.find({
        role:"admin"
        });

        for(const admin of admins)
        {

            await NotificationService.notify({
                event:"ticket.created.admin",
                userId:admin._id,
                payload:{
                    ticket,
                    actor:req.user
                }
            });
        }

        TicketRealtimeService.emitTicketUpdated(
            ticket._id
        );

        res.status(201).json({
            message:"Ticket created successfully",
            ticket
        });
    }
    catch(error)
    {
        res.status(500).json({
            message:error.message
        });
    }
};
const getMyTickets=async(req,res)=>{
    try{
        const tickets=await TicketService.getMyTickets({
            userId:req.user._id
        });
        res.status(200).json({
            count:tickets.length,
            tickets
        });
    }
    catch(error)
    {
        res.status(500).json({
            message:error.message
        });
    }
};
const getTicketById=async(req,res)=>{
    try{
        const {id}=req.params;
        const ticket=await Ticket.findById(id).populate("createdBy","name email").populate("assignedTo","name email");
        if(!ticket)
            {
                return res.status(404).json({
                    message:"Ticket not found"
                });
            }
        if(req.user.role==="student")
        {
            if(
                ticket.createdBy._id.toString()!==req.user._id.toString()
            )
            {
                return res.status(403).json({
                    message:"Access denied"
                });
            }
        }
        else if(req.user.role==="staff")
        {
            if(ticket.assignedTo?._id.toString()!==req.user._id.toString())
            {
                return res.status(403).json({
                    message:"Access denied"
                });
            }
        }
        res.status(200).json(ticket);
    }
    catch(error){
        res.status(500).json({
            message:error.message
        });
    }
};
const getAllTickets=async(req,res)=>{
    try{
        const tickets=await Ticket.find()
        .populate(
            "createdBy",
            "name email role"
        )
        .sort({createdAt:-1});
        res.status(200).json({
            count:tickets.length,
            tickets
        });



    }
    catch(error)
    {
        res.status(500).json({
            message:error.message
        });
    }
};
const assignTicket=async(req,res)=>{
    try{
        const {id}=req.params;
        const {staffId,reason}=req.body;
        const ticket=await Ticket.findById(id);
        if(!ticket)
        {
            return res.status(404).json({
                message:"Ticket not found"
            });
        }
        if(ticket.status==="Closed"){
            return res.status(400).json({
                message:"Closed tickets cannot be modified."
            });
        }
        const staff=await User.findById(staffId);
        if(
            ticket.assignedTo &&
            ticket.assignedTo.toString()===staffId
        )
        {
            return res.status(400).json({
                message:"Ticket is already assigned to this staff member."
            })
        }
        const previousStaff=ticket.assignedTo
        ?await User.findById(ticket.assignedTo)
        :null;
        if(!staff)
        {
            return res.status(404).json({
                message:"Staff not found"
            });
        }
        if(staff.role!=="staff")
        {
            return res.status(400).json({
                message:"User is not staff"
            })
        }
        if(
            ticket.status==="Resolved" ||
            ticket.status==="Closed" ||
            ticket.status==="Canceled"
        )
        {
            return res.status(400).json({
                message:"Cannot assigned resolved, closed or cancelled tickets"
            });
        }
        const isReassignment=!!ticket.assignedTo;
        ticket.assignedTo=staff._id;
        if(ticket.status==="Open")
        {
            ticket.status="Assigned";
        }
        ticket.assignedAt=new Date();
        await ticket.save();

        await TicketTimeline.create({
            ticket:ticket._id,
            title:isReassignment
            ?`Reassigned to ${staff.name}`
            :`Assigned to ${staff.name}`,
            description:isReassignment
            ?`Reassigned from ${previousStaff?.name} to ${staff.name}${
                reason
                ?`\nReason: ${reason}`
                :""
            }`
            :"Ticket assigned by admin",
            eventType:isReassignment
            ?"reassigned"
            :"assigned"
        });

        TicketRealtimeService.emitTimelineUpdated(ticket._id);

        if(!isReassignment)
        {
            await NotificationService.notify({
                event:"ticket.assigned.student",
                userId:ticket.createdBy,
                payload:{
                    ticket,
                    staff,
                    isReassignment
                }
            });

            await NotificationService.notify({
                event:"ticket.assigned.staff",
                userId:staff._id,
                payload:{
                    ticket,
                    staff,
                }
            });
        }
        else
        {
            await NotificationService.notify({
                event:"ticket.reassigned.student",
                userId:ticket.createdBy,
                payload:{
                    ticket,
                    staff,
                    previousStaff,
                    reason
                }
            });

            await NotificationService.notify({
                event:"ticket.reassigned.staff",
                userId:staff._id,
                payload:{
                    ticket,
                    staff,
                    previousStaff,
                    reason
                }

            });

            if(previousStaff)
            {
                await NotificationService.notify({
                    event:"ticket.reassigned.previousStaff",
                    userId:previousStaff._id,
                    payload:{
                        ticket,
                        staff,
                        previousStaff,
                        reason
                    }

                });
            }
        }

        TicketRealtimeService.emitTicketUpdated(
            ticket._id
        );

        res.status(200).json({
            message:isReassignment
            ?"Ticket reassigned successfully"
            :"Ticket assigned successfully",
            ticket
        });

    }
    catch(error)
    {
        res.status(500).json({
            message:error.message
        });
    }
};

const reassignTicket=async(req,res)=>{
    try{
        const {id}=req.params;
        const{staffId,reason}=req.body;
        const ticket=await Ticket.findById(id);
        if(!ticket)
        {
            return res.status(404).json({
                message:"Ticket not found"
            });
        }
        if(
            ticket.status==="Closed" ||
            ticket.status==="Canceled" ||
            ticket.status==="Resolved"
        )
        {
            return res.status(400).json({
                message:"This ticket cannot be reassigned."
            });
        }

        if(!ticket.assignedTo ||
            ticket.assignedTo.toString()!==req.user._id.toString()
        )
        {
            return res.status(403).json({
                message:"You can only reassign your own tickets."
            });
        }
        if(!reason || !reason.trim())
        {
            return res.status(400).json({
                message:"Reason is required."
            });
        }

        const newStaff=await User.findById(staffId);
        if(!newStaff)
        {
            return res.status(404).json({
                message:"Staff not found."
            });
        }
        if(newStaff.role!=="staff")
        {
            return res.status(400).json({
                message:"Selected user is not staff."
            });
        }
        if(newStaff._id.toString()===req.user._id.toString())
        {
            return res.status(400).json({
                message:"You are already assigned to this ticket."
            });
        }

        if(newStaff.department!==req.user.department)
        {
            return res.status(400).json({
                message:"You can only reassign within your department."
            });
        }
        const previousStaff=req.user;
        ticket.assignedTo=newStaff._id;
        ticket.assignedAt=new Date();
        await ticket.save();

        await TicketTimeline.create({
            ticket:ticket._id,
            title:"Ticket Reassigned",
            description:
            `Reassigned from ${previousStaff.name} to ${newStaff.name}.
            
            Reason:
            ${reason}`,
            eventType:"assigned"
        });

        TicketRealtimeService.emitTimelineUpdated(ticket._id);

        await NotificationService.notify({
            event:"ticket.reassigned.student",
            userId:ticket.createdBy,
            payload:{
                ticket,
                newStaff,
                previousStaff,
                reason
            }

        });

        await NotificationService.notify({
            event:"ticket.reassigned.staff",
            userId:newStaff._id,
            payload:{
                ticket,
                newStaff,
                previousStaff,
                reason
            }
        });

        await NotificationService.notify({
            event:"ticket.reassigned.previousStaff",
            userId:previousStaff._id,
            payload:{
                ticket,
                newStaff,
                previousStaff,
                reason
            }

        });

        const admins=await User.find({role:"admin"});
        for(const admin of admins){
            await NotificationService.notify({
                event:"ticket.reassigned.admin",
                userId:admin._id,
                payload:{
                    ticket,
                    staff:newStaff,
                    previousStaff,
                    reason
                }
            });
        }

        TicketRealtimeService.emitTicketUpdated(
            ticket._id
        );

        res.status(200).json({
            message:"Ticket reassigned successfully.",
            ticket
        });
    }
    catch(error)
    {
        res.status(500).json({
            message:error.message
        });
    }
};
const getAssignedTickets=async(req,res)=>{
    try{
        const tickets=await Ticket.find({assignedTo:req.user._id})
        .populate("createdBy","name email")
        .sort({createdAt:-1});

        res.status(200).json({
            count:tickets.length,
            tickets
        });
    }
    catch(error){
        res.status(500).json({
            message:error.message
        });
    }
};
const updateTicketStatus=async(req,res)=>{
    try{
        const {id}=req.params;
        const {status}=req.body;
        const allowedStatuses=[
            "Assigned",
            "In Progress",
            "Resolved",
            "Closed"
        ];
        if(!allowedStatuses.includes(status))
        {
            return res.status(400).json({
                message:"Invalid Status or calcelled tickets cannot be modified"
            });
        }
        const ticket=await Ticket.findById(id);
        if(!ticket)
        {
            return res.status(404).json({
                message:"Ticket not found"
            });
        }
        if(ticket.status==="Closed"){
            return res.status(400).json({
                message:"Closed tickets cannot be modified."
            });
        }
        if(ticket.status==="Canceled")
        {
            return res.status(400).json({
                message:"Canceled tickets cannot be modified"
            });
        }
        if(req.user.role==="staff")
        {
            if(
                !ticket.assignedTo || 
                ticket.assignedTo.toString() !==
                req.user._id.toString()
            )
            {
                return res.status(403).json({
                    message:"Access denied"
                })
            }
        }
        const previousStatus=ticket.status;
        if(
            status==="Resolved" &&
            (!ticket.resolutionNotes ||
            !ticket.resolutionNotes.trim())
        )
        {
            return res.status(400).json({
                message:
                "Resolution notes are required before marking a ticket as Resolved."
            })
        }
        if(
            status==="In Progress" &&
            !ticket.assignedTo
        )
        {
            return res.status(400).json({
                message:
                "Assign the ticket before moving it to In Progress."
            });
        }
        if(
            status==="Assigned" &&
            !ticket.assignedTo
        )
        {
            return res.status(400).json({
                message:"Assign a staff membe before setting status to Assigned."
            });
        }
        ticket.status=status;
        if(status==="Resolved" && !ticket.resolvedAt)
        {
            ticket.resolvedAt=new Date();
        }
        if(status==="Closed" && !ticket.closedAt)
        {
            ticket.closedAt=new Date();
        }
        await ticket.save();

        await TicketTimeline.create({
            ticket:ticket._id,
            title:"Status Updated",
            description:`Changed from ${previousStatus} to ${status}`,
            eventType:"status"
        });

        TicketRealtimeService.emitTimelineUpdated(ticket._id);

        if(status==="Resolved")
        {
            const admins=await User.find({role:"admin"});
            for(const admin of admins)
            {
                await NotificationService.notify({
                    event:"ticket.resolved.admin",
                    userId:admin._id,
                    payload:{
                        ticket,
                        staff:req.user
                    }
                });
            }

            await NotificationService.notify({
                event:"ticket.resolved.student",
                userId:ticket.createdBy,
                payload:{
                    ticket
                }
            });

            await NotificationService.notify({
                event:"ticket.resolved.staff",
                userId:ticket.assignedTo,
                payload:{
                    ticket,
                    staff:req.user
                }
            });
        }
        // if(status==="Closed")
        // {
        //     await NotificationService.notify({
        //         event:"ticket.closed.student",
        //         userId:ticket.createdBy,
        //         payload:{
        //             ticket,
        //             reviewNotes
        //         }
        //     });

        //     await NotificationService.notify({
        //         event:"ticket.closed.staff",
        //         userId:ticket.assignedTo,
        //         payload:{
        //             ticket,
        //             staff,
        //             reviewNotes
        //         }
        //     });
        // }

        if(status==="In Progress")
        {
            await NotificationService.notify({
                event:"ticket.inProgress.student",
                userId:ticket.createdBy,
                payload:{
                    ticket,
                    staff:req.user
                }
            });
        }

        TicketRealtimeService.emitTicketUpdated(
            ticket._id
        );

        res.status(200).json({
            message:"Status updated sucessfully",
            ticket
        });

    }
    catch(error)
    {
        res.status(500).json({
            message:error.message
        });
    }
};

const approveResolvedTicket=async(req,res)=>{
    try{
        const {id}=req.params;
        const{reviewNotes}=req.body;

        const ticket=await Ticket.findById(id);

        if(!ticket)
        {
            return res.status(400).json({
                message:"Ticket not found"
            });
        }
        if(ticket.status==="Closed"){
            return res.status(400).json({
                message:"Closed tickets cannot be modified."
            });
        }

        if(ticket.status!=="Resolved")
        {
            return res.status(400).json({
                message:"Only resolved tickets can be approved."
            });
        }

        ticket.status="Closed";
        ticket.closedAt=new Date();

        ticket.adminReview={
            reviewedBy:req.user._id,
            decision:"Approved",
            reviewNotes:reviewNotes||"",
            reviewedAt:new Date()
        };

        await ticket.save();

        await TicketTimeline.create({
            ticket:ticket._id,
            title:"Resolution Approved",
            description: reviewNotes
            ?`Admin approved the resolution.\nReview Notes: ${reviewNotes}`
            :"Admin approved the resolution.",
            eventType:"review"
        });

        TicketRealtimeService.emitTimelineUpdated(ticket._id);

        await NotificationService.notify({
            event:"ticket.review.approved.student",
            userId:ticket.createdBy,
            payload:{
                ticket,
                reviewNotes
            }

        });

        if(ticket.assignedTo)
        {
            await NotificationService.notify({
                event:"ticket.review.approved.staff",
                userId:ticket.assignedTo,
                payload:{
                    ticket,
                    reviewNotes
                }
            });
        }

        TicketRealtimeService.emitTicketUpdated(
            ticket._id
        );

        return res.status(200).json({
            message:"Ticket approved successfully.",
            ticket
        });
    }
    catch(error)
    {
        return res.status(500).json({
            message:error.message
        });
    }

};

const rejectResolvedTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const { reviewNotes } = req.body;

        if (!reviewNotes || !reviewNotes.trim()) {
            return res.status(400).json({
                message: "Review notes are required."
            });
        }

        const ticket = await Ticket.findById(id);

        if (!ticket) {
            return res.status(404).json({
                message: "Ticket not found"
            });
        }

        if(ticket.status==="Closed"){
            return res.status(400).json({
                message:"Closed tickets cannot be modified."
            });
        }

        if (ticket.status !== "Resolved") {
            return res.status(400).json({
                message: "Only resolved tickets can be rejected."
            });
        }

        ticket.status = "In Progress";

        ticket.adminReview = {
            reviewedBy: req.user._id,
            decision: "Rejected",
            reviewNotes,
            reviewedAt: new Date()
        };

        await ticket.save();

        await TicketTimeline.create({
            ticket: ticket._id,
            title: "Resolution Rejected",
            description: `Admin rejected the resolution.\nReason: ${reviewNotes}`,
            eventType: "review"
        });

        TicketRealtimeService.emitTimelineUpdated(ticket._id);

        await NotificationService.notify({
            event:"ticket.review.rejected.student",
            userId:ticket.createdBy,
            payload:{
                ticket,
                reviewNotes
            }
        });

        if (ticket.assignedTo) {
            await NotificationService.notify({
                event:"ticket.review.rejected.staff",
                userId:ticket.assignedTo,
                payload:{
                    ticket,
                    staff:req.user,
                    reviewNotes
                }
            });
        }

        TicketRealtimeService.emitTicketUpdated(
            ticket._id
        );

        return res.status(200).json({
            message: "Ticket sent back to staff.",
            ticket
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error.message
        });
    }
};

const updateResolutionNotes=async(req,res)=>{
    try{
        const {id}=req.params;
        const {resolutionNotes}=req.body;
        if(!resolutionNotes)
        {
            return res.status(400).json({
                message:"Resolution notes required"
            });
        }
        const ticket=await Ticket.findById(id);
        if(!ticket)
        {
            return res.status(404).json({
                message:"Ticket not found"
            });
        }
        if(ticket.status==="Closed"){
            return res.status(400).json({
                message:"Closed tickets cannot be modified."
            });
        }
        if(ticket.status==="Canceled")
        {
            return res.status(400).json({
                message:"Canceled tickets cannot be modified"
            });
        }
        if(req.user.role==="staff")
        {
            if(
                !ticket.assignedTo ||
                ticket.assignedTo.toString() !==
                req.user._id.toString()
            )
            {
                return res.status(403).json({
                    message:"Access denied"
                });
            }
        }
        // if(
        //     ticket.status!=="Resolved" &&
        //     ticket.status!=="Closed"
        // )
        // {
        //     return res.status(400).json({
        //         message:"Resolution notes can only be added to resolved or closed tickets"
        //     });
        // }
        ticket.resolutionNotes=resolutionNotes;
        await ticket.save();

        await TicketTimeline.create({
            ticket:ticket._id,
            title:"Resolution Added",
            description:"Resolution notes were added",
            eventType:"resolution"
        });

        TicketRealtimeService.emitTimelineUpdated(ticket._id);

        await NotificationService.notify({
            event:"ticket.resolutionNotes.student",
            userId:ticket.createdBy,
            payload:{
                ticket
            }
        });

        TicketRealtimeService.emitTicketUpdated(
            ticket._id
        );

        res.status(200).json({
            message:"Resolution notes updated successfully",
            ticket
        });
    }
    catch(error)
    {
        res.status(500).json({
            message:error.message
        });
    }
};

const getTicketTimeline=async(req,res)=>{
    try{
        const timeline=await TicketTimeline.find({
            ticket:req.params.id
        }).sort({createdAt:1});
        res.status(200).json({
            count:timeline.length,
            timeline
        });
    }
    catch(error)
    {
        res.status(500).json({
            message:error.message
        });
    }
}

const updateTicket=async(req,res)=>{
    try{
        const ticket=await Ticket.findById(req.params.id);
        if(!ticket)
        {
            return res.status(404).json({
                message:"Ticket not found"
            });
        }
        if(ticket.status==="Closed"){
            return res.status(400).json({
                message:"Closed tickets cannot be modified."
            });
        }
        if(ticket.createdBy.toString()!==req.user._id.toString())
        {
            return res.status(403).json({
                message:"Acces denied"
            });
        }
        if(ticket.status!=="Open")
        {
            return res.status(400).json({
                message:"Only open tickets can be edited"
            });
        }
        const {
            title,
            description,
            department,
            category,
            priority
        }=req.body;

        ticket.title=title;
        ticket.description=description;
        ticket.department=department;
        ticket.category=category;
        ticket.priority=priority;

        await ticket.save();
        const admins=await User.find({
            role:"admin"
        });

        for(const admin of admins)
        {
            await NotificationService.notify({
                event:"ticket.updated.admin",
                userId:admin._id,
                payload:{
                    ticket,
                    actor:req.user
                }
            });
        }
        if(ticket.assignedTo)
        {
            await NotificationService.notify({
                event:"ticket.updated.staff",
                userId:ticket.assignedTo,
                payload:{
                    ticket,
                    actor:req.user,
                }
            });
        }

        await TicketTimeline.create({
            ticket:ticket._id,
            title:"Ticket Updated",
            description:"Student updated ticket details",
            eventType:"updated"
        })

        TicketRealtimeService.emitTimelineUpdated(ticket._id);

        TicketRealtimeService.emitTicketUpdated(
            ticket._id
        );

        res.status(200).json({
            message:"Ticket updated succesfully",
            ticket
        });
    }
    catch(error)
    {
        res.status(500).json({
            message:error.message
        });
    }
};

const cancelTicket=async(req,res)=>{
    try{
        const {
            reason
        }=req.body;

        const ticket=await Ticket.findById(req.params.id);
        if(ticket.status==="Closed"){
            return res.status(400).json({
                message:"Closed tickets cannot be modified."
            });
        }
        if(!ticket)
        {
            return res.status(404).json({
                message:"Ticket not found"
            });
        }
        if(ticket.createdBy.toString()!==req.user._id.toString())
        {
            return res.status(403).json({
                message:"Access denied"
            });
        }
        if(ticket.status!=="Open" && ticket.status!=="Assigned")
        {
            return res.status(400).json({
                message:"Cannot cancel this ticket"
            });
        }

        if(!reason || !reason.trim())
        {
            return res.status(400).json({
                message:
                "Cancellation reason is required."
            });
        }

        ticket.cancelation={
            canceledBy:req.user._id,
            reason,
            canceledAt:new Date()
        };

        ticket.status="Canceled";
        await ticket.save();

        await NotificationService.notify({
            event:"ticket.cancelled.student",
            userId:ticket.createdBy,
            payload:{
                ticket,
                reason
            }
        });

        if(ticket.assignedTo)
        {
            await NotificationService.notify({
                event:"ticket.cancelled.staff",
                userId:ticket.assignedTo,
                payload:{
                    ticket,
                    reason
                }
            });
        }

        const admins=await User.find({
            role:"admin"
        }).select("_id");

        for(const admin of admins)
        {
            await NotificationService.notify({
                event:"ticket.cancelled.admin",
                userId:admin._id,
                payload:{
                    ticket,
                    actor:req.user,
                    reason
                }
            });
        }

        await TicketTimeline.create({
            ticket:ticket._id,
            title:"Ticket Canceled",
            description
            :`Canceled by ${req.user.name}.
            
            Reason:
            ${reason}`,
            eventType:"canceled"
        });

        TicketRealtimeService.emitTimelineUpdated(ticket._id);

        TicketRealtimeService.emitTicketUpdated(
            ticket._id
        );

        res.status(200).json({
            message:"Ticket cancelled sucessfully",
            ticket
        });
    }
    catch(error)
    {
        res.status(500).json({
            message:error.message
        });
    }
};

const adminCancelTicket = async (req, res) => {
    try {

        const { id } = req.params;
        const { reason } = req.body;

        if (!reason || !reason.trim()) {
            return res.status(400).json({
                message: "Cancellation reason is required."
            });
        }

        const ticket = await Ticket.findById(id);

        if (!ticket) {
            return res.status(404).json({
                message: "Ticket not found."
            });
        }

        if (ticket.status === "Canceled") {
            return res.status(400).json({
                message: "Ticket is already canceled."
            });
        }

        if (ticket.status === "Closed") {
            return res.status(400).json({
                message: "Closed tickets cannot be canceled."
            });
        }

        ticket.status = "Canceled";

        ticket.cancelation = {
            canceledBy: req.user._id,
            reason,
            canceledAt: new Date()
        };

        await ticket.save();

        await TicketTimeline.create({
            ticket:ticket._id,
            title:"Ticket Canceled",
            description:`Canceled by admin.\nReason: ${reason}`,
            eventType:"canceled"
        });

        TicketRealtimeService.emitTimelineUpdated(ticket._id);

        await NotificationService.notify({
            event:"ticket.cancelled.student",
            userId:ticket.createdBy,
            payload:{
                ticket,
                reason
            }

        });

        if(ticket.assignedTo)
        {
            await NotificationService.notify({
                event:"ticket.cancelled.staff",
                userId:ticket.assignedTo,
                payload:{
                    ticket,
                    reason
                }
            });
        }

        TicketRealtimeService.emitTicketUpdated(
            ticket._id
        );

        return res.status(200).json({
            message:"Ticket canceled successfully.",
            ticket
        });
    }
    catch(error)
    {
        console.error(error);
        return res.status(500).json({
            message:error.message
        })
    }
}
module.exports={
    createTicket,
    getMyTickets,
    getTicketById,
    getAllTickets,
    assignTicket,
    getAssignedTickets,
    updateTicketStatus,
    updateResolutionNotes,
    getTicketTimeline,
    updateTicket,
    cancelTicket,
    approveResolvedTicket,
    rejectResolvedTicket,
    reassignTicket,
    adminCancelTicket
};