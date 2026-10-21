import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    Legend
} from "recharts";
const COLORS=[
    "#2563eb",
    "#16a34a",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6"
];
function ReportsCharts({
    ticketTrendData,
    categoryData,
    resolutionData
})
{
    return(
        <div className="grid grid-cols-3 gap-6 mt-6">
            <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-lg font-semibold mb-4">
                    Tickets Trend
                </h2>
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={ticketTrendData}>
                        <XAxis dataKey="date"/>
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                        type="monotone"
                        dataKey="assigned"
                        stroke="#8B5CF6"/>
                        <Line
                        type="monotone"
                        dataKey="open"
                        stroke="#3B82F6"/>
                        <Line
                        type="monotone"
                        dataKey="inProgress"
                        stroke="#F59E0B"/>
                        <Line
                        type="monotone"
                        dataKey="resolved"
                        stroke="#10B981"/>
                        <Line
                        type="monotone"
                        dataKey="closed"
                        stroke="#EF4444"/>
                    </LineChart>
                    
                </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-lg font-semibold mb-4">
                    Tickets By Category
                </h2>
                <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                        <Pie
                        data={categoryData}
                        dataKey="value"
                        outerRadius={80}
                        >
                            {categoryData.map(
                                (entry,index)=>(
                                    <Cell key={index}
                                    fill={COLORS[index%COLORS.length]}
                                    />
                                )
                            )}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-lg font-semibold mb-4">
                    Status Chart
                </h2>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={resolutionData}>
                        <XAxis dataKey="range"/>
                        <YAxis />
                        <Tooltip />
                        <Bar
                        dataKey="tickets"
                        fill="#2563eb"/>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
export default ReportsCharts;