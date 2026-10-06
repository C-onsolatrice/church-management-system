"use client";

import { useQuery } from "@tanstack/react-query";
import { Activity, Calendar, Users, Wallet } from "lucide-react";
import { getRecentActivities } from "@/lib/dashboard";

type ActivityItem = {
  id: string;
  type: "MEMBER" | "TITHE" | "EVENT" | "ATTENDANCE";
  title: string;
  description?: string;
  createdAt: string;
};

export default function RecentActivities() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["recent-activities"],
    queryFn: getRecentActivities,
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow p-6">
        <p className="text-gray-500">Loading recent activities...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow p-6">
        <p className="text-red-500">Failed to load recent activities.</p>
      </div>
    );
  }

  const activities: ActivityItem[] = data ?? [];

  const getIcon = (type: string) => {
    switch (type) {
      case "MEMBER":
        return <Users className="w-5 h-5 text-blue-600" />;
      case "TITHE":
        return <Wallet className="w-5 h-5 text-green-600" />;
      case "EVENT":
        return <Calendar className="w-5 h-5 text-purple-600" />;
      default:
        return <Activity className="w-5 h-5 text-orange-600" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold mb-6">
        Recent Activities
      </h2>

      {activities.length === 0 ? (
        <p className="text-gray-500">
          No recent activities found.
        </p>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start justify-between border-b pb-4 last:border-none"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-gray-100">
                  {getIcon(activity.type)}
                </div>

                <div>
                  <h3 className="font-medium">
                    {activity.title}
                  </h3>

                  {activity.description && (
                    <p className={"\r\n            text-sm\r\n            text-gray-500\r\n          "}>
                      {activity.description}
                    </p>
                  )}
                </div>
              </div>

              <span className="text-xs text-gray-400 whitespace-nowrap">
                {new Date(activity.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}