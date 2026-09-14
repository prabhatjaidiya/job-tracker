import {
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
    LabelList,
} from "recharts";

const Charts = ({ statusChartData }) => {
    return (
        <div className="p-4 sm:p-6">
            <div className="min-w-0">
                <div className="h-[360px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={statusChartData}
                            margin={{
                                top: 35,
                                right: 10,
                                left: -10,
                                bottom: 25,
                            }}
                            barCategoryGap="18%"
                        >
                            <defs>
                                <linearGradient
                                    id="appliedGradient"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="0%"
                                        stopColor="#60A5FA"
                                    />
                                    <stop
                                        offset="100%"
                                        stopColor="#2563EB"
                                    />
                                </linearGradient>

                                <linearGradient
                                    id="interviewsGradient"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="0%"
                                        stopColor="#A78BFA"
                                    />
                                    <stop
                                        offset="100%"
                                        stopColor="#7C3AED"
                                    />
                                </linearGradient>

                                <linearGradient
                                    id="assessmentsGradient"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="0%"
                                        stopColor="#FBBF24"
                                    />
                                    <stop
                                        offset="100%"
                                        stopColor="#D97706"
                                    />
                                </linearGradient>

                                <linearGradient
                                    id="offersGradient"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="0%"
                                        stopColor="#34D399"
                                    />
                                    <stop
                                        offset="100%"
                                        stopColor="#059669"
                                    />
                                </linearGradient>

                                <linearGradient
                                    id="rejectedGradient"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="0%"
                                        stopColor="#FB7185"
                                    />
                                    <stop
                                        offset="100%"
                                        stopColor="#E11D48"
                                    />
                                </linearGradient>

                                <linearGradient
                                    id="withdrawnGradient"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="0%"
                                        stopColor="#94A3B8"
                                    />
                                    <stop
                                        offset="100%"
                                        stopColor="#475569"
                                    />
                                </linearGradient>
                            </defs>

                            <CartesianGrid
                                vertical={false}
                                stroke="#E2E8F0"
                                strokeDasharray="4 4"
                            />

                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                interval={0}
                                tick={{
                                    fill: "#64748B",
                                    fontSize: 11,
                                    fontWeight: 500,
                                }}
                                dy={10}
                            />

                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                allowDecimals={false}
                                width={30}
                                tick={{
                                    fill: "#94A3B8",
                                    fontSize: 12,
                                }}
                            />

                            <Tooltip
                                cursor={{
                                    fill: "rgba(148, 163, 184, 0.08)",
                                }}
                                contentStyle={{
                                    borderRadius: "14px",
                                    border: "1px solid #E2E8F0",
                                    boxShadow:
                                        "0 12px 30px rgba(15, 23, 42, 0.10)",
                                    padding: "12px 14px",
                                }}
                                labelStyle={{
                                    color: "#0F172A",
                                    fontWeight: 700,
                                    marginBottom: "5px",
                                }}
                                itemStyle={{
                                    color: "#475569",
                                    fontWeight: 600,
                                }}
                                formatter={(value) => [
                                    `${value} applications`,
                                    "Count",
                                ]}
                            />

                            <Bar
                                dataKey="value"
                                name="Applications"
                                radius={[9, 9, 3, 3]}
                                maxBarSize={60}
                            >
                                <LabelList
                                    dataKey="value"
                                    position="top"
                                    fill="#334155"
                                    fontSize={14}
                                    fontWeight={700}
                                />

                                {statusChartData.map((entry) => (
                                    <Cell
                                        key={entry.name}
                                        fill={entry.gradient}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="mt-2 flex flex-wrap justify-center gap-x-5 gap-y-3 border-t border-slate-100 pt-5">
                    {statusChartData.map((item) => (
                        <div
                            key={item.name}
                            className="flex items-center gap-2"
                        >
                            <span
                                className="h-2.5 w-2.5 rounded-full"
                                style={{
                                    backgroundColor: item.color,
                                }}
                            />

                            <span className="text-xs font-medium text-slate-600">
                                {item.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div >
    )
}

export default Charts