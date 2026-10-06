"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import api from "@/lib/axios";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  ClipboardCheck,
  Clock3,
  Loader2,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";

type DashboardStats = {
  totalMembers: number;
  totalTithes: number;
  totalEvents: number;
  attendanceRate: number;
};

type TitheMonthlyData = {
  month: string;
  amount: number;
};

type Activity = {
  id?: string;
  title?: string;
  description?: string;
  type?: string;
  createdAt?: string;
  date?: string;
};

type DashboardEvent = {
  id: string;
  title: string;
  date: string;
  location?: string | null;
  type?: string | null;
};

type StatsResponse = {
  totalMembers?: number;
  totalTithes?: number;
  totalEvents?: number;
  attendanceRate?: number;
  membersGrowth?: Array<{
    month: string;
    count: number;
  }>;
};

const EMPTY_STATS: DashboardStats = {
  totalMembers: 0,
  totalTithes: 0,
  totalEvents: 0,
  attendanceRate: 0,
};

const EMPTY_TITHES: TitheMonthlyData[] = [];

const ATTENDANCE_DATA = [
  {
    name: "Present",
    value: 78,
  },
  {
    name: "Absent",
    value: 15,
  },
  {
    name: "Late",
    value: 7,
  },
];

const ATTENDANCE_COLORS = [
  "#22c55e",
  "#ef4444",
  "#f59e0b",
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-RW", {
    style: "currency",
    currency: "RWF",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatDate(date: string) {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  } catch {
    return date;
  }
}

function formatMonth(value: string) {
  if (!value) return "";

  const date = new Date(value);

  if (!Number.isNaN(date.getTime())) {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
    }).format(date);
  }

  return value.slice(0, 3);
}

export default function DashboardPage() {
  const [stats, setStats] =
    useState<DashboardStats>(EMPTY_STATS);

  const [monthlyTithes, setMonthlyTithes] =
    useState<TitheMonthlyData[]>(EMPTY_TITHES);

  const [membersGrowth, setMembersGrowth] =
    useState<Array<{ month: string; count: number }>>([]);

  const [activities, setActivities] =
    useState<Activity[]>([]);

  const [events, setEvents] =
    useState<DashboardEvent[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const currentYear =
    new Date().getFullYear();

  const monthlyGoal = 5000000;

  const goalPercentage = useMemo(() => {
    if (monthlyGoal <= 0) return 0;

    return Math.min(
      Math.round(
        (stats.totalTithes / monthlyGoal) * 100,
      ),
      100,
    );
  }, [stats.totalTithes]);

  useEffect(() => {
    let mounted = true;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const [
          statsResponse,
          tithesResponse,
          activitiesResponse,
          eventsResponse,
        ] = await Promise.allSettled([
          api.get("/dashboard/stats"),
          api.get("/dashboard/tithes/monthly"),
          api.get("/dashboard/activities"),
          api.get("/events"),
        ]);

        if (!mounted) return;

        if (
          statsResponse.status === "fulfilled"
        ) {
          const data =
            statsResponse.value?.data as StatsResponse;

          setStats({
            totalMembers:
              Number(data?.totalMembers) || 0,

            totalTithes:
              Number(data?.totalTithes) || 0,

            totalEvents:
              Number(data?.totalEvents) || 0,

            attendanceRate:
              Number(data?.attendanceRate) || 0,
          });

          if (
            Array.isArray(data?.membersGrowth)
          ) {
            setMembersGrowth(
              data.membersGrowth.map((item) => ({
                month: item.month,
                count: Number(item.count) || 0,
              })),
            );
          }
        }

        if (
          tithesResponse.status ===
          "fulfilled"
        ) {
          const data =
            tithesResponse.value?.data;

          const rows = Array.isArray(data)
            ? data
            : Array.isArray(data?.data)
              ? data.data
              : [];

          setMonthlyTithes(
            rows.map((item: any) => ({
              month:
                item.month ||
                item.label ||
                item.date ||
                "",
              amount:
                Number(
                  item.amount ??
                    item.total ??
                    item.sum ??
                    0,
                ) || 0,
            })),
          );
        }

        if (
          activitiesResponse.status ===
          "fulfilled"
        ) {
          const data =
            activitiesResponse.value?.data;

          const rows = Array.isArray(data)
            ? data
            : Array.isArray(data?.data)
              ? data.data
              : [];

          setActivities(rows.slice(0, 6));
        }

        if (
          eventsResponse.status === "fulfilled"
        ) {
          const data =
            eventsResponse.value?.data;

          const rows = Array.isArray(data)
            ? data
            : Array.isArray(data?.data)
              ? data.data
              : [];

          const sortedEvents = [...rows]
            .filter((event: DashboardEvent) =>
              Boolean(event?.date),
            )
            .sort(
              (
                a: DashboardEvent,
                b: DashboardEvent,
              ) =>
                new Date(a.date).getTime() -
                new Date(b.date).getTime(),
            )
            .slice(0, 5);

          setEvents(sortedEvents);
        }

        const failedRequests = [
          statsResponse,
          tithesResponse,
          activitiesResponse,
          eventsResponse,
        ].filter(
          (result) =>
            result.status === "rejected",
        );

        if (
          failedRequests.length > 0 &&
          failedRequests.length <
            4
        ) {
          console.warn(
            "Some dashboard API requests failed.",
            failedRequests,
          );
        }

        if (
          failedRequests.length === 4
        ) {
          setError(
            "Dashboard data could not be loaded. Check that the backend is running on port 4001.",
          );
        }
      } catch (err) {
        console.error(
          "Dashboard loading error:",
          err,
        );

        if (mounted) {
          setError(
            "Failed to load dashboard data.",
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  const statsCards = [
    {
      title: "Total Members",
      value: formatNumber(
        stats.totalMembers,
      ),
      icon: Users,
      trend: "+12.5%",
      trendUp: true,
      description:
        "Registered church members",
    },
    {
      title: "Total Tithes",
      value: formatCurrency(
        stats.totalTithes,
      ),
      icon: CircleDollarSign,
      trend: "+8.2%",
      trendUp: true,
      description:
        "Total recorded contributions",
    },
    {
      title: "Church Events",
      value: formatNumber(
        stats.totalEvents,
      ),
      icon: CalendarDays,
      trend: "+4.6%",
      trendUp: true,
      description:
        "Total church events",
    },
    {
      title: "Attendance Rate",
      value: `${stats.attendanceRate}%`,
      icon: ClipboardCheck,
      trend:
        stats.attendanceRate >= 70
          ? "+5.1%"
          : "-2.4%",
      trendUp:
        stats.attendanceRate >= 70,
      description:
        "Average attendance",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Church Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Monitor your church activities,
            finances and membership.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2">
          <Clock3 className="h-4 w-4 text-blue-400" />

          <span className="text-sm text-slate-300">
            {currentYear}
          </span>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-300">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading dashboard data...
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statsCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl shadow-black/5"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10">
                  <Icon className="h-5 w-5 text-blue-400" />
                </div>

                <div
                  className={[
                    "flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold",
                    card.trendUp
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-red-500/10 text-red-400",
                  ].join(" ")}
                >
                  {card.trendUp ? (
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  ) : (
                    <ArrowDownRight className="h-3.5 w-3.5" />
                  )}

                  {card.trend}
                </div>
              </div>

              <p className="mt-5 text-sm font-medium text-slate-400">
                {card.title}
              </p>

              <p className="mt-2 truncate text-2xl font-bold text-white">
                {card.value}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                {card.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Tithes chart */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 xl:col-span-2">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Monthly Tithes
              </h2>

              <p className="text-sm text-slate-500">
                Tithe contribution trend
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-blue-500/10 px-3 py-2 text-xs font-medium text-blue-400">
              <TrendingUp className="h-4 w-4" />
              Revenue
            </div>
          </div>

          <div className="h-[320px]">
            {monthlyTithes.length > 0 ? (
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <AreaChart
                  data={monthlyTithes}
                >
                  <defs>
                    <linearGradient
                      id="titheGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#2563eb"
                        stopOpacity={0.35}
                      />
                      <stop
                        offset="100%"
                        stopColor="#2563eb"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    stroke="#1e293b"
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="month"
                    tickFormatter={
                      formatMonth
                    }
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#64748b",
                      fontSize: 12,
                    }}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#64748b",
                      fontSize: 12,
                    }}
                    tickFormatter={(value) =>
                      `${Math.round(
                        Number(value) / 1000,
                      )}K`
                    }
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor:
                        "#0f172a",
                      border:
                        "1px solid #334155",
                      borderRadius:
                        "12px",
                      color: "#fff",
                    }}
                    formatter={(
                      value: number,
                    ) => [
                      formatCurrency(
                        Number(value),
                      ),
                      "Tithes",
                    ]}
                    labelFormatter={(
                      label,
                    ) =>
                      formatMonth(
                        String(label),
                      )
                    }
                  />

                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fill="url(#titheGradient)"
                    dot={false}
                    activeDot={{
                      r: 6,
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChartState
                icon={Wallet}
                text="No monthly tithe data available yet."
              />
            )}
          </div>
        </div>

        {/* Attendance chart */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Attendance
            </h2>

            <p className="text-sm text-slate-500">
              Attendance overview
            </p>
          </div>

          <div className="relative mt-4 h-[260px]">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>
                <Pie
                  data={ATTENDANCE_DATA}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={72}
                  outerRadius={100}
                  paddingAngle={4}
                  stroke="none"
                >
                  {ATTENDANCE_DATA.map(
                    (_, index) => (
                      <Cell
                        key={`attendance-${index}`}
                        fill={
                          ATTENDANCE_COLORS[
                            index
                          ]
                        }
                      />
                    ),
                  )}
                </Pie>

                <Tooltip
                  contentStyle={{
                    backgroundColor:
                      "#0f172a",
                    border:
                      "1px solid #334155",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-3xl font-bold text-white">
                  {stats.attendanceRate}%
                </p>

                <p className="text-xs text-slate-500">
                  Overall
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {ATTENDANCE_DATA.map(
              (item, index) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{
                        backgroundColor:
                          ATTENDANCE_COLORS[
                            index
                          ],
                      }}
                    />

                    <span className="text-sm text-slate-400">
                      {item.name}
                    </span>
                  </div>

                  <span className="text-sm font-semibold text-white">
                    {item.value}%
                  </span>
                </div>
              ),
            )}
          </div>
        </div>
      </div>

      {/* Lower charts */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Members Growth */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-white">
              Members Growth
            </h2>

            <p className="text-sm text-slate-500">
              Monthly member registrations
            </p>
          </div>

          <div className="h-[300px]">
            {membersGrowth.length > 0 ? (
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart
                  data={membersGrowth}
                >
                  <CartesianGrid
                    stroke="#1e293b"
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="month"
                    tickFormatter={
                      formatMonth
                    }
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#64748b",
                      fontSize: 12,
                    }}
                  />

                  <YAxis
                    allowDecimals={false}
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#64748b",
                      fontSize: 12,
                    }}
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor:
                        "#0f172a",
                      border:
                        "1px solid #334155",
                      borderRadius:
                        "12px",
                      color: "#fff",
                    }}
                  />

                  <Bar
                    dataKey="count"
                    fill="#3b82f6"
                    radius={[
                      6,
                      6,
                      0,
                      0,
                    ]}
                    barSize={34}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChartState
                icon={Users}
                text="No members growth data available yet."
              />
            )}
          </div>
        </div>

        {/* Monthly Goal */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Monthly Tithe Goal
              </h2>

              <p className="text-sm text-slate-500">
                Track this month's progress
              </p>
            </div>

            <div className="rounded-xl bg-emerald-500/10 p-2.5">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-3xl font-bold text-white">
                  {formatCurrency(
                    stats.totalTithes,
                  )}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  of {formatCurrency(monthlyGoal)}
                </p>
              </div>

              <p className="text-2xl font-bold text-blue-400">
                {goalPercentage}%
              </p>
            </div>

            <div className="mt-6 h-4 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-700"
                style={{
                  width: `${goalPercentage}%`,
                }}
              />
            </div>

            <div className="mt-4 flex justify-between text-xs text-slate-500">
              <span>RWF 0</span>

              <span>
                Goal:{" "}
                {formatCurrency(
                  monthlyGoal,
                )}
              </span>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-slate-800/50 p-4">
              <p className="text-xs text-slate-500">
                Remaining
              </p>

              <p className="mt-1 text-lg font-semibold text-white">
                {formatCurrency(
                  Math.max(
                    monthlyGoal -
                      stats.totalTithes,
                    0,
                  ),
                )}
              </p>
            </div>

            <div className="rounded-xl bg-slate-800/50 p-4">
              <p className="text-xs text-slate-500">
                Completion
              </p>

              <p className="mt-1 text-lg font-semibold text-emerald-400">
                {goalPercentage}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Events and activities */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Upcoming events */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Upcoming Events
              </h2>

              <p className="text-sm text-slate-500">
                Next scheduled church events
              </p>
            </div>

            <CalendarDays className="h-5 w-5 text-blue-400" />
          </div>

          {events.length > 0 ? (
            <div className="space-y-3">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-950/50 p-4"
                >
                  <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-blue-500/10">
                    <span className="text-xs font-medium uppercase text-blue-400">
                      {new Date(
                        event.date,
                      ).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                        },
                      )}
                    </span>

                    <span className="text-lg font-bold text-white">
                      {new Date(
                        event.date,
                      ).getDate()}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold text-white">
                      {event.title}
                    </h3>

                    <p className="mt-1 truncate text-xs text-slate-500">
                      {event.location ||
                        event.type ||
                        "Church event"}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {formatDate(
                        event.date,
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex min-h-[220px] items-center justify-center">
              <div className="text-center">
                <CalendarDays className="mx-auto h-10 w-10 text-slate-700" />

                <p className="mt-3 text-sm text-slate-500">
                  No upcoming events.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Recent activities */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Recent Activities
              </h2>

              <p className="text-sm text-slate-500">
                Latest church management activities
              </p>
            </div>

            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          </div>

          {activities.length > 0 ? (
            <div className="space-y-1">
              {activities.map(
                (activity, index) => (
                  <div
                    key={
                      activity.id ||
                      `${activity.title}-${index}`
                    }
                    className="flex gap-4 rounded-xl p-3 transition hover:bg-slate-800/50"
                  >
                    <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-500/10">
                      <CheckCircle2 className="h-4 w-4 text-blue-400" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white">
                        {activity.title ||
                          "Activity"}
                      </p>

                      <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                        {activity.description ||
                          activity.type ||
                          "Church activity recorded"}
                      </p>

                      {(activity.createdAt ||
                        activity.date) && (
                        <p className="mt-1 text-[11px] text-slate-600">
                          {formatDate(
                            String(
                              activity.createdAt ||
                                activity.date,
                            ),
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                ),
              )}
            </div>
          ) : (
            <div className="flex min-h-[220px] items-center justify-center">
              <div className="text-center">
                <CheckCircle2 className="mx-auto h-10 w-10 text-slate-700" />

                <p className="mt-3 text-sm text-slate-500">
                  No recent activities.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyChartState({
  icon: Icon,
  text,
}: {
  icon: React.ComponentType<{
    className?: string;
  }>;
  text: string;
}) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800">
          <Icon className="h-6 w-6 text-slate-600" />
        </div>

        <p className="mt-3 text-sm text-slate-500">
          {text}
        </p>
      </div>
    </div>
  );
}