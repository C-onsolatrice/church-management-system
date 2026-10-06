'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DollarSign, FileText, TrendingUp, TrendingDown, RefreshCw, PlusCircle } from 'lucide-react';

interface Transaction {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  description: string;
  referenceNumber: string;
  transactionDate: string;
  incomeCategory?: string;
  expenseCategory?: string;
}

export default function FinanceDashboard() {
  const queryClient = useQueryClient();

  // Load cashbook data
  const { data: cashbook, isLoading } = useQuery<Transaction[]>({
    queryKey: ['cashbook'],
    queryFn: async () => {
      const res = await fetch('/api/v1/finance/cashbook');
      return res.json();
    },
  });

  const totalIncome = cashbook?.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + Number(t.amount), 0) || 0;
  const totalExpense = cashbook?.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + Number(t.amount), 0) || 0;

  const handleExportPdf = () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    window.open(`/api/v1/finance/report/pdf?year=${currentYear}&month=${currentMonth}`, '_blank');
  };

  if (isLoading) return <div className="p-10 text-center text-slate-500">Loading ledger balances...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Financial Ledger</h1>
          <p className="text-sm text-slate-500">Manage church cash flow, checkbooks, budgets, and reporting assets</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExportPdf}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
          >
            <FileText size={16} /> Export Monthly PDF
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-5 md:grid-cols-3">
        <div className="border rounded-xl p-6 bg-white shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Total Revenue</p>
            <p className="text-2xl font-bold text-slate-900">RWF {totalIncome.toLocaleString()}</p>
          </div>
        </div>

        <div className="border rounded-xl p-6 bg-white shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-lg bg-rose-50 text-rose-600">
            <TrendingDown size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Total Expenses</p>
            <p className="text-2xl font-bold text-slate-900">RWF {totalExpense.toLocaleString()}</p>
          </div>
        </div>

        <div className="border rounded-xl p-6 bg-indigo-900 text-white shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-lg bg-indigo-800 text-indigo-200">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-xs text-indigo-200 uppercase tracking-wider font-semibold">Net Balance</p>
            <p className="text-2xl font-bold">RWF {(totalIncome - totalExpense).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Cashbook Ledger Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase text-slate-600">
              <th className="p-4">Reference</th>
              <th className="p-4">Date</th>
              <th className="p-4">Description</th>
              <th className="p-4">Category</th>
              <th className="p-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {cashbook?.map((tx) => (
              <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-mono text-xs font-semibold text-slate-500">{tx.referenceNumber}</td>
                <td className="p-4">{new Date(tx.transactionDate).toLocaleDateString()}</td>
                <td className="p-4 font-medium text-slate-900">{tx.description}</td>
                <td className="p-4 capitalize text-slate-500">
                  {tx.incomeCategory || tx.expenseCategory || 'General'}
                </td>
                <td className={`p-4 text-right font-bold ${tx.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {tx.type === 'INCOME' ? '+' : '-'} RWF {Number(tx.amount).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}