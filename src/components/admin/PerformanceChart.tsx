'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export interface MonthlyData {
  month: string;
  claims: number;
  resolved: number;
  amount: number;
}

interface PerformanceChartClientProps {
  data: MonthlyData[];
}

export function PerformanceChartClient({ data }: PerformanceChartClientProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Performance mensuelle</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorClaims" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 8, fontSize: 12 }}
                formatter={(value: number, name: string) => [
                  value,
                  name === 'claims' ? 'Réclamations' : 'Résolues',
                ]}
              />
              <Area
                type="monotone"
                dataKey="claims"
                stroke="#6366f1"
                strokeWidth={2}
                fill="url(#colorClaims)"
                name="claims"
              />
              <Area
                type="monotone"
                dataKey="resolved"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#colorResolved)"
                name="resolved"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex gap-6 mt-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block" />
            <span className="text-xs text-gray-600">Réclamations</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
            <span className="text-xs text-gray-600">Résolues</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
