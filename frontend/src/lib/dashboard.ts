import api from "./axios";

/**
 * Dashboard Statistics
 */
export async function getDashboardStats() {
  const response = await api.get("/dashboard/stats");
  return response.data;
}

/**
 * Monthly Tithes (Revenue Chart)
 */
export async function getMonthlyTithes() {
  const response = await api.get("/dashboard/tithes/monthly");
  return response.data;
}

/**
 * Recent Activities
 */
export async function getRecentActivities() {
  const response = await api.get("/dashboard/activities");
  return response.data;
}