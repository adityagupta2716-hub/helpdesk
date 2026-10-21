function NotificationCard({
    title,
    message,
    read,
    createdAt,
    onClick
}){
    return (
        <div onClick={onClick} className={`rounded-xl p-5 border transition ${
            read?"bg-white border-gray-200":"bg-blue-50 border-blue-200"
        }`}>
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-semibold text-lg">
                        {title}
                    </h3>
                    <p className="text-gray-600 mt-2">
                        {message}
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                        {
                            new Date(
                                createdAt
                            ).toLocaleDateString()
                        }
                    </p>
                </div>
                {!read && (
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                        New
                    </span>
                )}
            </div>
        </div>
    );
}
export default NotificationCard;