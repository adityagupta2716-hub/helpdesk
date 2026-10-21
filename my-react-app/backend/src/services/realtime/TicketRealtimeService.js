const {
    getIO
}=require("../../socket/SocketService");

function emit(room,event,payload)
{
    const io=getIO();

    io.to(room).emit(
        event,payload
    );
}

function emitTicketUpdated(ticketId)
{
    emit(
        `ticket:${ticketId}`,
        "ticketUpdated",
        {
            ticketId:ticketId.toString()
        }
    );
}

function emitTimelineUpdated(ticketId)
{
    emit(
        `ticket:${ticketId}`,
        "timelineUpdated",
        {
            ticketId:ticketId.toString()
        }
    );
}

function emitCommentCreated(comment)
{
    emit(
        `ticket:${comment.ticket}`,
        "commentCreated",
        comment
    );
}

function emitCommentDeleted(ticketId, commentId)
{
    emit(
        `ticket:${ticketId}`,
        "commentDeleted",
        {
            ticketId:ticketId.toString(),
            commentId: commentId.toString()
        }
    );
}

function emitAttachmentUploaded(attachment)
{
    emit(
        `ticket:${attachment.ticket}`,
        "attachmentUploaded",
        attachment
    );
}

function emitAttachmentDeleted(ticketId,attachmentId)
{
    emit(
        `ticket:${ticketId}`,
        "attachmentDeleted",
        {
            ticketId:ticketId.toString(),
            attachmentId:attachmentId.toString()
        }
    );
}
module.exports={
    emitTicketUpdated,
    emitTimelineUpdated,
    emitCommentCreated,
    emitCommentDeleted,
    emitAttachmentUploaded,
    emitAttachmentDeleted
};