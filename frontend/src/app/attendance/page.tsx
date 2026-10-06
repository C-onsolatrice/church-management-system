"use client";

import * as React from "react";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  CheckCircle2,
  Users,
  CalendarDays,
  Clock,
  XCircle,
} from "lucide-react";

import AttendanceChart from "@/components/attendance/AttendanceChart";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:4001/api/v1";

interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email?: string | null;
  phoneNumber?: string | null;
  branchId: string;
  status: string;
}

interface Event {
  id: string;
  title: string;
  date: string;
  location?: string | null;
  branchId: string;
}

interface Attendance {
  id: string;
  memberId: string;
  eventId: string;
  branchId: string;
  present: boolean;
  status: string;
  notes?: string | null;
  createdAt: string;

  member: Member;
  event: Event;
}

interface CreateAttendanceData {
  memberId: string;
  eventId: string;
  branchId: string;
  status: string;
  present: boolean;
  notes: string;
}

export default function AttendanceManager() {
  const queryClient =
    useQueryClient();

  const [memberId, setMemberId] =
    React.useState("");

  const [eventId, setEventId] =
    React.useState("");

  const [status, setStatus] =
    React.useState("PRESENT");

  const [notes, setNotes] =
    React.useState("");

  /*
   * ============================
   * MEMBERS
   * ============================
   */

  const {
    data: members = [],
    isLoading: membersLoading,
    isError: membersError,
  } = useQuery<Member[]>({
    queryKey: ["members"],
    queryFn: async () => {
      const response = await fetch(
        `${API_URL}/members`,
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load members",
        );
      }

      return response.json();
    },
  });

  /*
   * ============================
   * EVENTS
   * ============================
   */

  const {
    data: events = [],
    isLoading: eventsLoading,
    isError: eventsError,
  } = useQuery<Event[]>({
    queryKey: ["events"],
    queryFn: async () => {
      const response = await fetch(
        `${API_URL}/events`,
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load events",
        );
      }

      return response.json();
    },
  });

  /*
   * ============================
   * ATTENDANCE
   * ============================
   */

  const {
    data: attendance = [],
    isLoading: attendanceLoading,
  } = useQuery<Attendance[]>({
    queryKey: ["attendance"],
    queryFn: async () => {
      const response = await fetch(
        `${API_URL}/attendance`,
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load attendance",
        );
      }

      return response.json();
    },
  });

  /*
   * ============================
   * SAVE ATTENDANCE
   * ============================
   */

  const createAttendance =
    useMutation({
      mutationFn: async (
        data: CreateAttendanceData,
      ) => {
        const response = await fetch(
          `${API_URL}/attendance`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(data),
          },
        );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Failed to save attendance",
          );
        }

        return result;
      },

      onSuccess: () => {
        setMemberId("");
        setEventId("");
        setStatus("PRESENT");
        setNotes("");

        queryClient.invalidateQueries({
          queryKey: ["attendance"],
        });

        alert(
          "Attendance saved successfully!",
        );
      },

      onError: (error: Error) => {
        alert(error.message);
      },
    });

  /*
   * ============================
   * SUBMIT
   * ============================
   */

  const handleSubmit = (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

    if (!memberId) {
      alert(
        "Please select a member.",
      );
      return;
    }

    if (!eventId) {
      alert(
        "Please select an event.",
      );
      return;
    }

    const selectedMember =
      members.find(
        (member) =>
          member.id === memberId,
      );

    if (!selectedMember) {
      alert("Member not found.");
      return;
    }

    const present =
      status === "PRESENT" ||
      status === "LATE";

    createAttendance.mutate({
      memberId,
      eventId,
      branchId:
        selectedMember.branchId,
      status,
      present,
      notes,
    });
  };

  /*
   * ============================
   * MEMBER NAME
   * ============================
   */

  const getMemberName = (
    member: Member,
  ) => {
    return `${member.firstName} ${member.lastName}`;
  };

  /*
   * ============================
   * STATUS
   * ============================
   */

  const getStatusClass = (
    status: string,
  ) => {
    switch (status) {
      case "PRESENT":
        return "bg-green-100 text-green-700";

      case "LATE":
        return "bg-yellow-100 text-yellow-700";

      case "ABSENT":
        return "bg-red-100 text-red-700";

      case "EXCUSED":
        return "bg-blue-100 text-blue-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">

      {/* HEADER */}

      <div>
        <h1 className="text-3xl font-extrabold text-white">
          Attendance
        </h1>

        <p className="text-slate-400 mt-1">
          Manage church member attendance
        </p>
      </div>

      {/* STAT CARDS */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

        <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
          <Users
            className="text-blue-400 mb-3"
            size={25}
          />

          <p className="text-sm text-slate-400">
            Members
          </p>

          <p className="text-2xl font-bold text-white">
            {members.length}
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
          <CalendarDays
            className="text-purple-400 mb-3"
            size={25}
          />

          <p className="text-sm text-slate-400">
            Events
          </p>

          <p className="text-2xl font-bold text-white">
            {events.length}
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
          <CheckCircle2
            className="text-green-400 mb-3"
            size={25}
          />

          <p className="text-sm text-slate-400">
            Attendance
          </p>

          <p className="text-2xl font-bold text-white">
            {attendance.length}
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
          <Clock
            className="text-yellow-400 mb-3"
            size={25}
          />

          <p className="text-sm text-slate-400">
            Late
          </p>

          <p className="text-2xl font-bold text-white">
            {
              attendance.filter(
                (item) =>
                  item.status === "LATE",
              ).length
            }
          </p>
        </div>

      </div>

      {/* FORM */}

      <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">

        <h2 className="text-xl font-bold text-white mb-6">
          Record Attendance
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >

          {/* MEMBER */}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Member
            </label>

            <select
              value={memberId}
              onChange={(e) =>
                setMemberId(
                  e.target.value,
                )
              }
              className="w-full rounded-lg border border-slate-600 bg-slate-800 text-white p-3 outline-none focus:ring-2 focus:ring-blue-500"
            >

              <option value="">
                {membersLoading
                  ? "Loading members..."
                  : membersError
                  ? "Failed to load members"
                  : "Select Member"}
              </option>

              {members.map(
                (member) => (
                  <option
                    key={member.id}
                    value={member.id}
                  >
                    {getMemberName(
                      member,
                    )}
                  </option>
                ),
              )}

            </select>

            {members.length === 0 &&
              !membersLoading && (
                <p className="text-xs text-red-400 mt-2">
                  No members found.
                  Create members first.
                </p>
              )}
          </div>

          {/* EVENT */}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Event
            </label>

            <select
              value={eventId}
              onChange={(e) =>
                setEventId(
                  e.target.value,
                )
              }
              className="w-full rounded-lg border border-slate-600 bg-slate-800 text-white p-3 outline-none focus:ring-2 focus:ring-blue-500"
            >

              <option value="">
                {eventsLoading
                  ? "Loading events..."
                  : eventsError
                  ? "Failed to load events"
                  : "Select Event"}
              </option>

              {events.map(
                (event) => (
                  <option
                    key={event.id}
                    value={event.id}
                  >
                    {event.title}
                  </option>
                ),
              )}

            </select>

            {events.length === 0 &&
              !eventsLoading && (
                <p className="text-xs text-red-400 mt-2">
                  No events found.
                  Create an event first.
                </p>
              )}
          </div>

          {/* STATUS */}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Status
            </label>

            <select
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target.value,
                )
              }
              className="w-full rounded-lg border border-slate-600 bg-slate-800 text-white p-3"
            >
              <option value="PRESENT">
                Present
              </option>

              <option value="LATE">
                Late
              </option>

              <option value="ABSENT">
                Absent
              </option>

              <option value="EXCUSED">
                Excused
              </option>
            </select>
          </div>

          {/* NOTES */}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Notes
            </label>

            <input
              type="text"
              value={notes}
              onChange={(e) =>
                setNotes(
                  e.target.value,
                )
              }
              placeholder="Optional notes"
              className="w-full rounded-lg border border-slate-600 bg-slate-800 text-white p-3"
            />
          </div>

          {/* BUTTON */}

          <div className="md:col-span-2">

            <button
              type="submit"
              disabled={
                createAttendance.isPending ||
                members.length === 0 ||
                events.length === 0
              }
              className="w-full md:w-1/2 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white p-3 rounded-lg font-semibold transition"
            >
              {createAttendance.isPending
                ? "Saving..."
                : "Save Attendance"}
            </button>

          </div>

        </form>

      </div>

      {/* TABLE */}

      <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">

        <div className="p-5 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">
            Attendance Records
          </h2>
        </div>

        {attendanceLoading ? (
          <div className="p-8 text-center text-slate-400">
            Loading attendance...
          </div>
        ) : attendance.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            No attendance records yet.
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-slate-800">
                <tr>
                  <th className="text-left p-4 text-slate-300">
                    Member
                  </th>

                  <th className="text-left p-4 text-slate-300">
                    Event
                  </th>

                  <th className="text-left p-4 text-slate-300">
                    Status
                  </th>

                  <th className="text-left p-4 text-slate-300">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody>

                {attendance.map(
                  (item) => (
                    <tr
                      key={item.id}
                      className="border-t border-slate-700"
                    >

                      <td className="p-4 text-white">
                        {item.member
                          ? getMemberName(
                              item.member,
                            )
                          : "-"}
                      </td>

                      <td className="p-4 text-slate-300">
                        {item.event?.title ||
                          "-"}
                      </td>

                      <td className="p-4">

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                            item.status,
                          )}`}
                        >
                          {item.status}
                        </span>

                      </td>

                      <td className="p-4 text-slate-400">

                        {new Date(
                          item.createdAt,
                        ).toLocaleDateString()}

                      </td>

                    </tr>
                  ),
                )}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* CHART */}

      <AttendanceChart />

    </div>
  );
}