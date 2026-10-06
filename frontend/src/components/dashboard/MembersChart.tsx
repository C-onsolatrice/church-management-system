"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";


const membersData = [
  {
    month: "Jan",
    members: 120,
  },
  {
    month: "Feb",
    members: 180,
  },
  {
    month: "Mar",
    members: 250,
  },
  {
    month: "Apr",
    members: 320,
  },
];


export default function MembersChart() {
  return (
    <div className="bg-white rounded-xl shadow p-6">

      <h2 className="text-lg font-semibold mb-4">
        Members Growth
      </h2>


      <ResponsiveContainer width="100%" height={300}>

        <BarChart data={membersData}>

          <CartesianGrid strokeDasharray="3 3"/>

          <XAxis dataKey="month"/>

          <YAxis/>

          <Tooltip/>

          <Bar
            dataKey="members"
          />

        </BarChart>

      </ResponsiveContainer>

    </div>
  );
}