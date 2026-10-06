"use client";

import {
  useEffect,
  useState,
} from "react";

import api from "@/lib/axios";

interface UserItem {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
}

interface EventItem {
  id: string;
  title: string;
}

interface AttendanceItem {
  id: string;
  present: boolean;
  notes?: string;
  createdAt: string;
  user: UserItem;
  event: EventItem;
  branch: {
    name: string;
  };
}

export default function AttendancePage() {
  const [users, setUsers] =
    useState<UserItem[]>([]);

  const [events, setEvents] =
    useState<EventItem[]>([]);

  const [items, setItems] =
    useState<AttendanceItem[]>([]);

  const [form, setForm] = useState({
    userId: "",
    eventId: "",
    branchId: "",
    present: true,
    notes: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [
        usersResponse,
        eventsResponse,
        attendanceResponse,
      ] = await Promise.all([
        api.get("/users"),
        api.get("/events"),
        api.get("/attendance"),
      ]);

      setUsers(usersResponse.data);
      setEvents(eventsResponse.data);
      setItems(attendanceResponse.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function saveAttendance(
    e: React.FormEvent,
  ) {
    e.preventDefault();

    try {
      await api.post("/attendance", form);

      setForm({
        userId: "",
        eventId: "",
        branchId: "",
        present: true,
        notes: "",
      });

      await loadData();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="p-4 md:p-6">
      <h1 className="mb-6 text-3xl font-bold">
        Attendance
      </h1>

      <form
        onSubmit={saveAttendance}
        className="mb-6 grid gap-3 rounded-xl bg-white p-6 shadow dark:bg-gray-900 md:grid-cols-2"
      >
        <select
          required
          className="rounded-lg border p-3"
          value={form.userId}
          onChange={(e) =>
            setForm({
              ...form,
              userId:
                e.target.value,
            })
          }
        >
          <option value="">
            Select User
          </option>

          {users.map((user) => (
            <option
              key={user.id}
              value={user.id}
            >
              {user.name ||
                `${user.firstName || ""} ${user.lastName || ""}`}
            </option>
          ))}
        </select>

        <select
          required
          className="rounded-lg border p-3"
          value={form.eventId}
          onChange={(e) =>
            setForm({
              ...form,
              eventId:
                e.target.value,
            })
          }
        >
          <option value="">
            Select Event
          </option>

          {events.map((event) => (
            <option
              key={event.id}
              value={event.id}
            >
              {event.title}
            </option>
          ))}
        </select>

        <input
          required
          className="rounded-lg border p-3"
          placeholder="Branch ID"
          value={form.branchId}
          onChange={(e) =>
            setForm({
              ...form,
              branchId:
                e.target.value,
            })
          }
        />

        <select
          className="rounded-lg border p-3"
          value={
            form.present
              ? "present"
              : "absent"
          }
          onChange={(e) =>
            setForm({
              ...form,
              present:
                e.target.value ===
                "present",
            })
          }
        >
          <option value="present">
            Present
          </option>
          <option value="absent">
            Absent
          </option>
        </select>

        <textarea
          className="rounded-lg border p-3 md:col-span-2"
          placeholder="Notes"
          value={form.notes}
          onChange={(e) =>
            setForm({
              ...form,
              notes: e.target.value,
            })
          }
        />

        <button
          type="submit"
          className="rounded-lg bg-green-600 px-4 py-3 text-white"
        >
          Save Attendance
        </button>
      </form>

      <div className="overflow-auto rounded-xl bg-white shadow dark:bg-gray-900">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left">
              <th className="p-4">
                User
              </th>
              <th className="p-4">
                Event
              </th>
              <th className="p-4">
                Status
              </th>
              <th className="p-4">
                Date
              </th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className="border-b"
              >
                <td className="p-4">
                  {item.user.name ||
                    `${item.user.firstName || ""} ${item.user.lastName || ""}`}
                </td>

                <td className="p-4">
                  {item.event.title}
                </td>

                <td className="p-4">
                  {item.present
                    ? "Present"
                    : "Absent"}
                </td>

                <td className="p-4">
                  {new Date(
                    item.createdAt,
                  ).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}