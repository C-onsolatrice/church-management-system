'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, Shield, Music, Video, Calendar, ArrowRight, UserPlus } from 'lucide-react';

interface Ministry {
  id: string;
  name: string;
  type: 'CHOIR' | 'YOUTH' | 'WOMEN' | 'MEN' | 'EVANGELISM' | 'MEDIA';
  description: string;
  leader?: {
    firstName: string;
    lastName: string;
  };
  _count: {
    members: number;
    events: number;
  };
}

export default function MinistriesDashboard() {
  const { data: ministries, isLoading } = useQuery<Ministry[]>({
    queryKey: ['ministries'],
    queryFn: async () => {
      const res = await fetch('/api/v1/ministries');
      return res.json();
    },
  });

  const getMinistryIcon = (type: string) => {
    switch (type) {
      case 'CHOIR': return <Music className="text-pink-600" size={24} />;
      case 'MEDIA': return <Video className="text-blue-600" size={24} />;
      default: return <Users className="text-indigo-600" size={24} />;
    }
  };

  if (isLoading) return <div className="p-10 text-center text-slate-500">Loading department directories...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Ministries & Departments</h1>
        <p className={"\r\n            text-sm\r\n            text-gray-500\r\n          "}>Coordinate leadership roles, roster sizes, and departmental schedules</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {ministries?.map((ministry) => (
          <div key={ministry.id} className="border rounded-xl p-6 bg-white shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-slate-50 rounded-lg">
                  {getMinistryIcon(ministry.type)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{ministry.name}</h3>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 uppercase">
                    {ministry.type}
                  </span>
                </div>
              </div>

              <p className="text-sm text-slate-500 line-clamp-2">{ministry.description || 'No description provided.'}</p>
            </div>

            <div className="border-t pt-4 space-y-3">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Shield size={14} className="text-slate-400" />
                <span>Leader: <strong>{ministry.leader ? `${ministry.leader.firstName} ${ministry.leader.lastName}` : 'Unassigned'}</strong></span>
              </div>

              <div className="flex justify-between items-center text-xs text-slate-500">
                <span className="flex items-center gap-1"><Users size={14} /> {ministry._count.members} Members</span>
                <span className="flex items-center gap-1"><Calendar size={14} /> {ministry._count.events} Events</span>
              </div>
            </div>

            <button className="w-full flex items-center justify-center gap-2 py-2 border rounded-md text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
              Manage Department <ArrowRight size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}