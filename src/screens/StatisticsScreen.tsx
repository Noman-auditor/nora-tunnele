import { useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, Clock, Activity, Zap, BarChart3 } from 'lucide-react';
import { useStore } from '../store';
import { GlassCard, ScreenHeader, EmptyState, formatSpeed, formatBytes, formatUptime } from '../components';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface TrafficPoint {
  time: number;
  download: number;
  upload: number;
}

export function StatisticsScreen() {
  const { state } = useStore();
  const {
    connectionState,
    activeProfile,
    downloadSpeed,
    uploadSpeed,
    latency,
    uptime,
    totalDownload,
    totalUpload,
  } = state;

  const isConnected = connectionState === 'CONNECTED';
  const [trafficHistory, setTrafficHistory] = useState<TrafficPoint[]>([]);

  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(() => {
        setTrafficHistory(prev => {
          const next = [...prev, {
            time: Date.now(),
            download: downloadSpeed,
            upload: uploadSpeed,
          }];
          return next.slice(-60); // Keep last 60 data points
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isConnected, downloadSpeed, uploadSpeed]);

  if (!isConnected) {
    return (
      <div className="animate-fade-in">
        <ScreenHeader title="Live Network" subtitle="Real-time traffic statistics" />
        <EmptyState
          icon={<Activity size={48} />}
          title="Not connected"
          description="Connect to a tunnel profile to see live network statistics."
        />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <ScreenHeader
        title="LIVE NETWORK"
        subtitle={activeProfile ? `Connected to ${activeProfile.name}` : undefined}
      />

      {/* Traffic Graph */}
      <GlassCard className="p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-nora-text-tertiary uppercase tracking-wider">
            Traffic
          </span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-xs text-nora-text-tertiary">Download</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              <span className="text-xs text-nora-text-tertiary">Upload</span>
            </div>
          </div>
        </div>

        {trafficHistory.length > 2 ? (
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficHistory.map(p => ({
                ...p,
                t: ((p.time - trafficHistory[0].time) / 1000).toFixed(0),
              }))}>
                <defs>
                  <linearGradient id="downloadGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="uploadGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="t" hide />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ background: 'rgba(13,13,43,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '11px', color: '#f1f5f9' }}
                  formatter={((value: unknown) => formatSpeed(Number(value))) as never}
                />
                <Area type="monotone" dataKey="download" stroke="#3b82f6" fill="url(#downloadGrad)" strokeWidth={1.5} />
                <Area type="monotone" dataKey="upload" stroke="#8b5cf6" fill="url(#uploadGrad)" strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-40 flex items-center justify-center">
            <p className="text-xs text-nora-text-tertiary">Collecting data...</p>
          </div>
        )}
      </GlassCard>

      {/* Live Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <GlassCard accent="accent" className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <ArrowDown size={16} className="text-blue-400" />
            <span className="text-xs text-nora-text-tertiary">Download</span>
          </div>
          <p className="text-xl font-bold text-nora-text">{formatSpeed(downloadSpeed)}</p>
        </GlassCard>

        <GlassCard accent="purple" className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <ArrowUp size={16} className="text-purple-400" />
            <span className="text-xs text-nora-text-tertiary">Upload</span>
          </div>
          <p className="text-xl font-bold text-nora-text">{formatSpeed(uploadSpeed)}</p>
        </GlassCard>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <GlassCard className="p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Zap size={12} className="text-nora-accent" />
            <span className="text-xs text-nora-text-tertiary">Latency</span>
          </div>
          <p className="text-lg font-bold text-nora-text">
            {latency !== null ? `${latency} ms` : '—'}
          </p>
        </GlassCard>

        <GlassCard className="p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Clock size={12} className="text-nora-text-tertiary" />
            <span className="text-xs text-nora-text-tertiary">Uptime</span>
          </div>
          <p className="text-lg font-bold text-nora-text">{formatUptime(uptime)}</p>
        </GlassCard>

        <GlassCard className="p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <BarChart3 size={12} className="text-nora-text-tertiary" />
            <span className="text-xs text-nora-text-tertiary">Total</span>
          </div>
          <p className="text-lg font-bold text-nora-text">{formatBytes(totalDownload + totalUpload)}</p>
        </GlassCard>
      </div>

      {/* Data Transferred */}
      <GlassCard className="p-4">
        <span className="text-xs font-semibold text-nora-text-tertiary uppercase tracking-wider mb-3 block">
          Transferred
        </span>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <ArrowDown size={12} className="text-blue-400" />
              <span className="text-xs text-nora-text-tertiary">Download</span>
            </div>
            <p className="text-sm font-semibold text-nora-text">{formatBytes(totalDownload)}</p>
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <ArrowUp size={12} className="text-purple-400" />
              <span className="text-xs text-nora-text-tertiary">Upload</span>
            </div>
            <p className="text-sm font-semibold text-nora-text">{formatBytes(totalUpload)}</p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
