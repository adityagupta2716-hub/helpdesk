function RecentActivity({activities}){
    return(
        <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
                Recent Activity
            </h2>
            <div className="space-y-4">
                {activities.map(activity=>(
                    <div key={activity.id} className="border-b pb-3">
                        <p className="font-medium">
                            {activity.message}
                        </p>
                        <p className="text-sm text-gray-500">
                            {activity.time}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
export default RecentActivity;