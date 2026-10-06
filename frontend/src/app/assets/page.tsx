'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { HardDrive, Truck, Guitar, Monitor, Sofa, Calendar, ShieldCheck, PenTool, TrendingDown, Layers } from 'lucide-react';

interface Asset {
  id: string;
  name: string;
  category: 'BUILDING' | 'VEHICLE' | 'MUSICAL_INSTRUMENT' | 'COMPUTER' | 'FURNITURE';
  purchaseCost: string;
  purchaseDate: string;
  state: 'EXCELLENT' | 'GOOD' | 'NEEDS_REPAIR' | 'DECOMMISSIONED';
  location: string;
  _count: {
    maintenanceLogs: number;
  };
}

export default function AssetsPage() {
  const { data: assets, isLoading } = useQuery<Asset[]>({
    queryKey: ['assets-list'],
    queryFn: async () => {
      const res = await fetch('/api/v1/assets');
      return res.json();
    },
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'BUILDING': return <Layers className="text-emerald-600" size={20} />;
      case 'VEHICLE': return <Truck className="text-blue-600" size={20} />;
      case 'MUSICAL_INSTRUMENT': return <Guitar className="text-pink-600" size={20} />;
      case 'COMPUTER': return <Monitor className="text-indigo-600" size={20} />;
      default: return <Sofa className="text-amber-600" size={20} />;
    }
  };

  const getStatusColor = (state: string) => {
    switch (state) {
      case 'EXCELLENT': return 'bg-emerald-100 text-emerald-800';
      case 'GOOD': return 'bg-sky-100 text-sky-800';
      case 'NEEDS_REPAIR': return 'bg-rose-100 text-rose-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  if (isLoading) return <div className="p-10 text-center text-slate-500">Retrieving asset registers...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Asset & Property Registry</h1>
        <p className="text-sm text-slate-500">Track capital expenditures, monitor machine health, and view depreciation schedules</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {assets?.map((asset) => (
          <div key={asset.id} className="border rounded-2xl p-6 bg-white shadow-sm flex flex-col justify-between space-y-5 hover:shadow-md transition">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  {getCategoryIcon(asset.category)}
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${getStatusColor(asset.state)}`}>
                  {asset.state}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-lg">{asset.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">Located in: <span className="text-slate-600 font-medium">{asset.location}</span></p>
              </div>
            </div>

            <div className="border-y py-3.5 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-slate-400">Book Cost</p>
                <p className="font-semibold text-slate-900 mt-0.5">${Number(asset.purchaseCost).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Acquisition</p>
                <p className="font-semibold text-slate-900 mt-0.5">
                  {new Date(asset.purchaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2 border rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition">
                <PenTool size={14} /> Repair Log ({asset._count.maintenanceLogs})
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition">
                <TrendingDown size={14} /> Depreciation
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
