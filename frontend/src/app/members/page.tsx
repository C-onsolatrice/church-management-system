'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Search, Plus, RefreshCw } from 'lucide-react';

interface Member {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchMembers = async () => {
    try {
      setLoading(true);

      const response = await api.get('/users');

      setMembers(response.data.data);
      setFilteredMembers(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    const data = members.filter(
      (m) =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.email.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredMembers(data);
  }, [search, members]);

  return (
    <div className="p-8">

      <div className="flex justify-between items-center mb-8">

        <div>

          <h1 className="text-3xl font-bold">
            Members
          </h1>

          <p className="text-gray-500">
            Manage church members
          </p>

        </div>

        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg flex items-center gap-2">
          <Plus size={18} />
          Add Member
        </button>

      </div>

      <div className="bg-white rounded-xl shadow p-5 mb-6">

        <div className="flex gap-4">

          <div className="relative flex-1">

            <Search
              className="absolute left-3 top-3 text-gray-400"
              size={18}
            />

            <input
              type="text"
              placeholder="Search members..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded-lg pl-10 pr-4 py-3"
            />

          </div>

          <button
            onClick={fetchMembers}
            className="border px-4 rounded-lg hover:bg-gray-100 flex items-center gap-2"
          >
            <RefreshCw size={18} />
            Refresh
          </button>

        </div>

      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="text-left p-4">Name</th>

              <th className="text-left p-4">Email</th>

              <th className="text-left p-4">Phone</th>

              <th className="text-left p-4">Role</th>

              <th className="text-center p-4">Actions</th>

            </tr>

          </thead>

          <tbody>

            {loading ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-8"
                >
                  Loading...
                </td>
              </tr>
            ) : filteredMembers.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-8 text-gray-500"
                >
                  No members found
                </td>
              </tr>
            ) : (
              filteredMembers.map((member) => (
                <tr
                  key={member.id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-4 font-medium">
                    {member.name}
                  </td>

                  <td className="p-4">
                    {member.email}
                  </td>

                  <td className="p-4">
                    {member.phone || '-'}
                  </td>

                  <td className="p-4">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                      {member.role}
                    </span>
                  </td>

                  <td className="p-4 text-center">

                    <button className="text-blue-600 hover:underline mr-4">
                      Edit
                    </button>

                    <button className="text-red-600 hover:underline">
                      Delete
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