'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { School, Users, UserCheck, BookOpen, MapPin, Sparkles, FolderOpen } from 'lucide-react';

interface SundaySchoolClass {
  id: string;
  className: string;
  ageGroup: string;
  roomNumber: string;
  _count: {
    students: number;
    teachers: number;
  };
}

export default function SundaySchoolDashboard() {
  const { data: classes, isLoading } = useQuery<SundaySchoolClass[]>({
    queryKey: ['sunday-school-classes'],
    queryFn: async () => {
      const res = await fetch('/api/v1/sunday-school/classes');
      return res.json();
    },
  });

  if (isLoading) return <div className="p-10 text-center text-slate-500">Loading Sunday School registers...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Sunday School & Education</h1>
          <p className="text-sm text-slate-500">Monitor children age groups, lesson curriculums, and teaching volunteers</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {classes?.map((cls) => (
          <div key={cls.id} className="border rounded-2xl p-6 bg-white shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                  <School size={24} />
                </div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">
                  Ages: {cls.ageGroup}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-lg">{cls.className}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                  <MapPin size={12} /> Location: {cls.roomNumber || 'Assembly Hall'}
                </p>
              </div>
            </div>

            <div className="border-t pt-4 grid grid-cols-2 gap-4 text-center">
              <div className="bg-slate-50 rounded-lg p-2.5">
                <p className="text-xs text-slate-500 uppercase font-semibold">Enrolled</p>
                <p className="text-lg font-bold text-slate-900 mt-0.5">{cls._count.students} kids</p>
              </div>

              <div className="bg-slate-50 rounded-lg p-2.5">
                <p className="text-xs text-slate-500 uppercase font-semibold">Teachers</p>
                <p className="text-lg font-bold text-slate-900 mt-0.5">{cls._count.teachers} staff</p>
              </div>
            </div>

            <div className="space-y-2">
              <button className="w-full flex items-center justify-center gap-2 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition shadow-sm">
                <UserCheck size={16} /> Mark Today's Attendance
              </button>
              <button className="w-full flex items-center justify-center gap-2 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-semibold transition">
                <BookOpen size={16} /> Lesson Plans & Material
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}