import {
    ResponsiveContainer,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    LineChart,
    Line,
} from "recharts";

const ApplicationTrend = ({ applicationTrendData }) => {
    const formatDate = (date) => {
        return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-5 sm:p-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-blue-100 text-emerald-600">
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 19V5m0 14h16M7 15l4-4 3 3 5-6"
                            />
                        </svg>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-slate-900">
                            Application Trend
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                            Track how many applications you submitted over time.
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-4 sm:p-6">
                {applicationTrendData.length === 0 ? (
                    <div className="flex h-[270px] items-center justify-center">
                        <div className="text-center">
                            <p className="text-sm font-semibold text-slate-700">
                                No application history yet
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                                Your application trend will appear here.
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="h-[270px] w-full">
                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >
                                <LineChart
                                    data={applicationTrendData}
                                    margin={{
                                        top: 25,
                                        right: 20,
                                        left: -10,
                                        bottom: 20,
                                    }}
                                >
                                    <CartesianGrid
                                        vertical={false}
                                        stroke="#E2E8F0"
                                        strokeDasharray="4 4"
                                    />

                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        interval={0}
                                        tickFormatter={formatDate}
                                        tick={{
                                            fill: "#64748B",
                                            fontSize: 12,
                                            fontWeight: 500,
                                        }}
                                        dy={10}
                                    />

                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        allowDecimals={false}
                                        domain={[0, "dataMax + 1"]}
                                        width={30}
                                        tick={{
                                            fill: "#94A3B8",
                                            fontSize: 12,
                                        }}
                                    />

                                    <Tooltip
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
                                        labelFormatter={formatDate}
                                        formatter={(value) => [
                                            `${value} applications`,
                                            "Applications",
                                        ]}
                                    />

                                    <Line
                                        type="monotone"
                                        dataKey="applications"
                                        stroke="#2563EB"
                                        strokeWidth={3}
                                        dot={{
                                            r: 5,
                                            fill: "#2563EB",
                                            stroke: "#FFFFFF",
                                            strokeWidth: 2,
                                        }}
                                        activeDot={{
                                            r: 7,
                                        }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-5 grid gap-3 border-t border-slate-100 pt-5 sm:grid-cols-2">
                            <div className="rounded-2xl bg-slate-50 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    Recent activity
                                </p>

                                <p className="mt-1 text-lg font-bold text-slate-900">
                                    {applicationTrendData.reduce(
                                        (total, item) => total + item.applications,
                                        0
                                    )}{" "}
                                    applications
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                    Across {applicationTrendData.length} tracked days
                                </p>
                            </div>

                            <div className="rounded-2xl bg-blue-50/70 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-blue-500">
                                    Latest activity
                                </p>

                                <p className="mt-1 text-lg font-bold text-slate-900">
                                    {applicationTrendData.length > 0
                                        ? applicationTrendData[
                                            applicationTrendData.length - 1
                                        ].applications
                                        : 0}{" "}
                                    applications
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                    {applicationTrendData.length > 0
                                        ? formatDate(
                                            applicationTrendData[
                                                applicationTrendData.length - 1
                                            ].date
                                        )
                                        : "No recent activity"}
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default ApplicationTrend
