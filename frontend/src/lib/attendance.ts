import api from "./axios";

export interface Attendance {
  id: string;

  memberId: string;
  eventId: string;
  branchId: string;

  present: boolean;
  status: string;
  notes?: string | null;

  createdAt: string;
  updatedAt: string;

  member?: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string | null;
    phoneNumber?: string | null;
  };

  event?: {
    id: string;
    title: string;
    date: string;
    location?: string | null;
  };

  branch?: {
    id: string;
    name: string;
  };
}

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email?: string | null;
  phoneNumber?: string | null;
  status?: string;
  branchId?: string | null;
}

export interface Event {
  id: string;
  title: string;
  description?: string | null;
  date: string;
  location?: string | null;
  branchId: string;
}

export interface AttendanceStatistics {
  total: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  attendanceRate: number;
}

export async function getAttendance(): Promise<Attendance[]> {
  const response = await api.get("/attendance");
  return response.data;
}

export async function getAttendanceStatistics(): Promise<AttendanceStatistics> {
  const response = await api.get("/attendance/statistics");
  return response.data;
}

export async function getAttendanceChart() {
  const response = await api.get("/attendance/chart");
  return response.data;
}

export async function getMembers(): Promise<Member[]> {
  const response = await api.get("/members");
  return response.data;
}

export async function getEvents(): Promise<Event[]> {
  const response = await api.get("/events");
  return response.data;
}

export async function createAttendance(data: {
  memberId: string;
  eventId: string;
  branchId: string;
  present: boolean;
  status: string;
  notes?: string;
}) {
  const response = await api.post("/attendance", data);
  return response.data;
}