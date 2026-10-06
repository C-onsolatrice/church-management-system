"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useQuery } from "@tanstack/react-query";
import { getAttendanceChart } from "@/lib/attendance";

export default function AttendanceChart() {
  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["attendance-chart"],
    queryFn: getAttendanceChart,
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow p-6 mt-6">
        <p>Loading attendance chart...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-xl shadow p-6 mt-6">
        <p className="text-red-500">
          Failed to load attendance chart.
        </p>
      </div>
    );
  }

  const chartData =
    data?.map((item: any) => ({
      month: new Date(
        `${item.month}-01`,
      ).toLocaleString("default", {
        month: "short",
      }),
      Present: Number(item.present ?? 0),
      Absent: Number(item.absent ?? 0),
      Late: Number(item.late ?? 0),
      Excused: Number(item.excused ?? 0),
    })) ?? [];

  return (
    <div className="bg-white rounded-xl shadow p-6 mt-6">
      <h2 className="text-xl font-semibold mb-5">
        Attendance Overview
      </h2>

      {chartData.length === 0 ? (
        <div className="h-[350px] flex items-center justify-center text-gray-500">
          No attendance data available.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Bar dataKey="Present" />

            <Bar dataKey="Absent" />

            <Bar dataKey="Late" />

            <Bar dataKey="Excused" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}