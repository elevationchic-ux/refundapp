'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Globe, Clock, TrendingUp } from 'lucide-react';

interface Stats {
  activeVisitors: number;
  totalVisitorsToday: number;
  total: number;
  pending: number;
  resolved: number;
  unreadMessages: number;
  ts: number;
}

export function VisitorStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const eventSource = new EventSource('/api/admin/sse');
    
    eventSource.onopen = () => {
      setConnected(true);
    };
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setStats(data);
      } catch (e) {
        console.error('Failed to parse SSE data:', e);
      }
    };
    
    eventSource.onerror = () => {
      setConnected(false);
    };
    
    return () => {
      eventSource.close();
    };
  }, []);

  const cards = [
    {
      title: 'Visiteurs en ligne',
      value: stats?.activeVisitors ?? 0,
      sub: 'Actifs ces 5 dernières minutes',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Visiteurs aujourd\'hui',
      value: stats?.totalVisitorsToday ?? 0,
      sub: 'Nouvelles sessions',
      icon: Globe,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Dossiers en attente',
      value: stats?.pending ?? 0,
      sub: `Sur ${stats?.total ?? 0} total`,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Messages non lus',
      value: stats?.unreadMessages ?? 0,
      sub: 'En attente de réponse',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Connection status */}
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
        <span className="text-xs text-gray-500">
          {connected ? 'En direct' : 'Déconnecté'}
        </span>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{card.value}</div>
              <p className="text-xs text-gray-500 mt-1">{card.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Last update */}
      {stats?.ts && (
        <p className="text-xs text-gray-400 text-center">
          Dernière mise à jour: {new Date(stats.ts).toLocaleTimeString('fr-FR')}
        </p>
      )}
    </div>
  );
}
