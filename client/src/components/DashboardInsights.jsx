const DashboardInsights = ({ stats, applicationTrendData }) => {
    // -----------------------------------------
    // DASHBOARD INSIGHTS
    // -----------------------------------------

    const statusValues = [
        { label: "Applied", value: stats.applied },
        { label: "Interviews", value: stats.interviews },
        { label: "Assessments", value: stats.assessments },
        { label: "Offers", value: stats.offers },
        { label: "Rejected", value: stats.rejected },
        { label: "Withdrawn", value: stats.withdrawn },
    ];

    const maxStatusValue = Math.max(
        ...statusValues.map((status) => status.value)
    );

    const mostCommonStatuses =
        stats.totalApplications > 0
            ? statusValues.filter(
                (status) => status.value === maxStatusValue
            )
            : [];

    const interviewRate =
        stats.totalApplications > 0
            ? Math.round(
                (stats.interviews / stats.totalApplications) * 100
            )
            : 0;

    const latestTrend =
        applicationTrendData.length > 0
            ? applicationTrendData[applicationTrendData.length - 1]
            : null;

    const recentApplicationCount = applicationTrendData.reduce(
        (total, item) => total + item.applications,
        0
    );
    return (
        <>
            {/* Dashboard Insights */}
            < div className="mt-6" >
                <div className="mb-4">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                        Insights
                    </p>

                    <h3 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                        What your data means
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                        A quick interpretation of your current application activity.
                    </p>
                </div>

                {
                    stats.totalApplications === 0 ? (
                        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-xl">
                                💡
                            </div>

                            <h4 className="mt-4 text-lg font-bold text-slate-900">
                                No insights yet
                            </h4>

                            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                                Add your first application to start seeing useful insights
                                about your job search.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                            {/* Interview Activity */}
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-lg">
                                    💬
                                </div>

                                <h4 className="mt-4 text-sm font-bold text-slate-700">
                                    Interview Activity
                                </h4>

                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    {stats.interviews > 0
                                        ? `You currently have ${stats.interviews} applications in the Interview stage.`
                                        : "You don't have any applications in the Interview stage yet."}
                                </p>
                            </div>

                            {/* Offers */}
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-lg">
                                    ⭐
                                </div>

                                <h4 className="mt-4 text-sm font-bold text-slate-700">
                                    Offer Activity
                                </h4>

                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    {stats.offers > 0
                                        ? `You've received ${stats.offers} offers so far.`
                                        : "You don't have any offers yet."}
                                </p>
                            </div>

                            {/* Most Common Status */}
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-lg">
                                    📊
                                </div>

                                <h4 className="mt-4 text-sm font-bold text-slate-700">
                                    Most Common Statuses
                                </h4>

                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    {mostCommonStatuses.length === 1
                                        ? `${mostCommonStatuses[0].label} is currently your most common application status.`
                                        : `${mostCommonStatuses
                                            .map((status) => status.label)
                                            .join(
                                                " and "
                                            )} are currently your most common application statuses.`}
                                </p>
                            </div>

                            {/* Interview Rate */}
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-lg">
                                    📈
                                </div>

                                <h4 className="mt-4 text-sm font-bold text-slate-700">
                                    Interview Rate
                                </h4>

                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    Your interview rate is approximately{" "}
                                    <span className="font-bold text-slate-800">
                                        {interviewRate}%
                                    </span>
                                    .
                                </p>
                            </div>
                        </div>
                    )
                }
            </div>
        </>
    )
}

export default DashboardInsights
