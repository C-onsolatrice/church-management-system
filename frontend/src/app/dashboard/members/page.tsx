"use client";

import {
  useEffect,
  useState,
} from "react";

import api from "@/lib/axios";

interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email?: string | null;
  phoneNumber?: string | null;
  status: string;
  branch?: {
    name: string;
  } | null;
}

export default function MembersPage() {
  const [members, setMembers] =
    useState<Member[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    branchId: "",
  });

  const [showForm, setShowForm] =
    useState(false);

  useEffect(() => {
    loadMembers();
  }, []);

  async function loadMembers() {
    try {
      setLoading(true);

      const response =
        await api.get("/members");

      setMembers(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function addMember(
    e: React.FormEvent,
  ) {
    e.preventDefault();

    try {
      await api.post("/members", {
        ...form,
        branchId:
          form.branchId || undefined,
      });

      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        branchId: "",
      });

      setShowForm(false);

      await loadMembers();
    } catch (error) {
      console.error(
        "Add member error:",
        error,
      );
    }
  }

  async function deleteMember(id: string) {
    const confirmed =
      window.confirm(
        "Deactivate this member?",
      );

    if (!confirmed) return;

    try {
      await api.delete(
        `/members/${id}`,
      );

      await loadMembers();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Members
          </h1>

          <p className="text-gray-500">
            Manage church members
          </p>
        </div>

        <button
          onClick={() =>
            setShowForm(!showForm)
          }
          className="rounded-lg bg-blue-600 px-4 py-2 text-white"
        >
          + Add Member
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={addMember}
          className="mb-6 grid gap-3 rounded-xl bg-white p-6 shadow dark:bg-gray-900 md:grid-cols-2"
        >
          <input
            className="rounded-lg border p-3"
            placeholder="First name"
            value={form.firstName}
            onChange={(e) =>
              setForm({
                ...form,
                firstName:
                  e.target.value,
              })
            }
            required
          />

          <input
            className="rounded-lg border p-3"
            placeholder="Last name"
            value={form.lastName}
            onChange={(e) =>
              setForm({
                ...form,
                lastName:
                  e.target.value,
              })
            }
            required
          />

          <input
            className="rounded-lg border p-3"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
          />

          <input
            className="rounded-lg border p-3"
            placeholder="Phone"
            value={form.phoneNumber}
            onChange={(e) =>
              setForm({
                ...form,
                phoneNumber:
                  e.target.value,
              })
            }
          />

          <input
            className="rounded-lg border p-3"
            placeholder="Branch ID (optional)"
            value={form.branchId}
            onChange={(e) =>
              setForm({
                ...form,
                branchId:
                  e.target.value,
              })
            }
          />

          <button
            type="submit"
            className="rounded-lg bg-green-600 px-4 py-3 text-white"
          >
            Save Member
          </button>
        </form>
      )}

      <div className="overflow-auto rounded-xl bg-white shadow dark:bg-gray-900">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b text-left">
              <th className="p-4">
                Name
              </th>

              <th className="p-4">
                Email
              </th>

              <th className="p-4">
                Phone
              </th>

              <th className="p-4">
                Branch
              </th>

              <th className="p-4">
                Status
              </th>

              <th className="p-4">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={6}
                  className="p-6 text-center"
                >
                  Loading...
                </td>
              </tr>
            ) : members.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="p-6 text-center text-gray-500"
                >
                  No members found
                </td>
              </tr>
            ) : (
              members.map((member) => (
                <tr
                  key={member.id}
                  className="border-b"
                >
                  <td className="p-4">
                    {member.firstName}{" "}
                    {member.lastName}
                  </td>

                  <td className="p-4">
                    {member.email || "-"}
                  </td>

                  <td className="p-4">
                    {member.phoneNumber ||
                      "-"}
                  </td>

                  <td className="p-4">
                    {member.branch?.name ||
                      "No branch"}
                  </td>

                  <td className="p-4">
                    {member.status}
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() =>
                        deleteMember(
                          member.id,
                        )
                      }
                      className="rounded-lg bg-red-600 px-3 py-1 text-white"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}