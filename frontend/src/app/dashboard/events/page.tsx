"use client";

import {
  useEffect,
  useState,
} from "react";

import api from "@/lib/axios";

interface EventItem {
  id: string;
  title: string;
  description?: string;
  type?: string;
  date: string;
  location?: string;
  branch?: {
    name: string;
  };
}

export default function EventsPage() {
  const [events, setEvents] =
    useState<EventItem[]>([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "SERVICE",
    date: "",
    location: "",
    branchId: "",
  });

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    try {
      const response =
        await api.get("/events");

      setEvents(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function addEvent(
    e: React.FormEvent,
  ) {
    e.preventDefault();

    try {
      await api.post("/events", {
        ...form,
        branchId: form.branchId,
      });

      setForm({
        title: "",
        description: "",
        type: "SERVICE",
        date: "",
        location: "",
        branchId: "",
      });

      await loadEvents();
    } catch (error) {
      console.error(error);
    }
  }

  async function removeEvent(id: string) {
    if (
      !window.confirm(
        "Delete this event?",
      )
    ) {
      return;
    }

    try {
      await api.delete(`/events/${id}`);

      await loadEvents();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="p-4 md:p-6">
      <h1 className="mb-6 text-3xl font-bold">
        Church Events
      </h1>

      <form
        onSubmit={addEvent}
        className="mb-6 grid gap-3 rounded-xl bg-white p-6 shadow dark:bg-gray-900 md:grid-cols-2"
      >
        <input
          required
          className="rounded-lg border p-3"
          placeholder="Event title"
          value={form.title}
          onChange={(e) =>
            setForm({
              ...form,
              title: e.target.value,
            })
          }
        />

        <select
          className="rounded-lg border p-3"
          value={form.type}
          onChange={(e) =>
            setForm({
              ...form,
              type: e.target.value,
            })
          }
        >
          <option value="SERVICE">
            Service
          </option>
          <option value="CONFERENCE">
            Conference
          </option>
          <option value="MEETING">
            Meeting
          </option>
          <option value="YOUTH">
            Youth
          </option>
        </select>

        <input
          required
          type="datetime-local"
          className="rounded-lg border p-3"
          value={form.date}
          onChange={(e) =>
            setForm({
              ...form,
              date: e.target.value,
            })
          }
        />

        <input
          className="rounded-lg border p-3"
          placeholder="Location"
          value={form.location}
          onChange={(e) =>
            setForm({
              ...form,
              location:
                e.target.value,
            })
          }
        />

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

        <textarea
          className="rounded-lg border p-3 md:col-span-2"
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description:
                e.target.value,
            })
          }
        />

        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-3 text-white"
        >
          Add Event
        </button>
      </form>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {events.map((event) => (
          <div
            key={event.id}
            className="rounded-xl bg-white p-5 shadow dark:bg-gray-900"
          >
            <h2 className="text-xl font-bold">
              {event.title}
            </h2>

            <p className="mt-2 text-gray-500">
              {event.description ||
                "No description"}
            </p>

            <p className="mt-3">
              📅{" "}
              {new Date(
                event.date,
              ).toLocaleString()}
            </p>

            <p>
              📍{" "}
              {event.location ||
                "No location"}
            </p>

            <p className="mt-2">
              Type: {event.type}
            </p>

            <button
              onClick={() =>
                removeEvent(event.id)
              }
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}