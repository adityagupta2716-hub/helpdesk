import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend
} from "recharts";

const COLORS=[
    "#3B82F6",
    "#10B981",
    "#F59E08",
    "#EF4444",
    "#8B5CF6",
];
function DonutChart({
    title,
    data
}){
    return(
        <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
                {title}
            </h2>
            <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie 
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={90}
                        innerRadius={50}
                        >
                            {data.map(
                                (entry,index)=>(
                                    <Cell key={index}
                                    fill={COLORS[index%COLORS.length]}/>
                                )
                            )}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
export default DonutChart;