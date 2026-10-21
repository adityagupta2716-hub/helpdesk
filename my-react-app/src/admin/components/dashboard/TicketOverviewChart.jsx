import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from "recharts";
function TicketsOverviewChart({data=[]}){
    return(
        <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
                Tickets Overview
            </h2>
            <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="date"/>
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                        type="monotone"
                        dataKey="assigned"
                        stroke="#6366F1"
                        />
                        <Line
                        type="monotone"
                        dataKey="open"
                        stroke="#3B82F6"
                        />
                        <Line
                        type="monotone"
                        dataKey="inProgress"
                        stroke="#F59E0B"
                        />
                        <Line
                        type="monotone"
                        dataKey="resolved"
                        stroke="#10B981"
                        />
                        <Line
                        type="monotone"
                        dataKey="closed"
                        stroke="#8B5CF6"
                        />
                        

                    
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
export default TicketsOverviewChart;