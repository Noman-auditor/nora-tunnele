import { useState } from 'react';
import { ScrollText, Search, X, Trash2, Pause, Play } from 'lucide-react';
import { useStore } from '../store';
import { GlassCard, ScreenHeader, EmptyState } from '../components';
import type { LogCategory, LogLevel } from '../types';

const LOG_CATEGORIES: { cat: LogCategory | 'all'; label: string }[] = [
  { cat: 'all', label: 'All' },
  { cat: 'connection', label: 'Connection' },
  { cat: 'core', label: 'Core' },
  { cat: 'dns', label: 'DNS' },
  { cat: 'routing', label: 'Routing' },
  { cat: 'system', label: 'System' },
  { cat: 'error', label: 'Errors' },
];

const LEVEL_COLORS: Record<LogLevel, string> = {
  debug: '#64748b',
  info: '#3b82f6',
  warn: '#f59e0b',
  error: '#ef4444',
};

function redactSecrets(message: string): string {
  return message
    .replace(/password=\S+/gi, 'password=******')
    .replace(/privateKey=\S+/gi, 'privateKey=******')
    .replace(/token=\S+/gi, 'token=******')
    .replace(/secret=\S+/gi, 'secret=******')
    .replace(/key=\S+/gi, 'key=******')
    .replace(/auth=\S+/gi, 'auth=******');
}

export function LogsScreen() {
  const { state, dispatch } = useStore();
  const { logs, selectedLogCategory } = state;

  const [searchQuery, setSearchQuery] = useState('');
  const [isPaused, setIsPaused] = useState(false);

  const filteredLogs = logs
    .filter(l => selectedLogCategory === 'all' || l.category === selectedLogCategory)
    .filter(l => !searchQuery || l.message.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(-100)
    .reverse();

  const formatTime = (ts: number) =>
    new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className="animate-fade-in">
      <ScreenHeader
        title="Logs"
        subtitle={`${logs.length} entries`}
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-2 rounded-lg hover:bg-white/5"
            >
              {isPaused ? <Play size={16} className="text-nora-accent" /> : <Pause size={16} className="text-nora-text-tertiary" />}
            </button>
            <button
              onClick={() => dispatch({ type: 'CLEAR_LOGS' })}
              className="p-2 rounded-lg hover:bg-white/5"
            >
              <Trash2 size={16} className="text-nora-text-tertiary" />
            </button>
          </div>
        }
      />

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-3 no-scrollbar">
        {LOG_CATEGORIES.map(c => (
          <button
            key={c.cat}
            onClick={() => dispatch({ type: 'SET_LOG_CATEGORY', category: c.cat })}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              selectedLogCategory === c.cat
                ? 'glass-accent text-nora-accent'
                : 'glass text-nora-text-secondary hover:bg-white/5'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-nora-text-tertiary" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search logs..."
          className="w-full pl-9 pr-8 py-2 rounded-xl glass border border-nora-border bg-transparent text-xs text-nora-text placeholder-nora-text-tertiary focus:outline-none focus:border-nora-accent/30"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2">
            <X size={12} className="text-nora-text-tertiary" />
          </button>
        )}
      </div>

      {/* Log Entries */}
      {filteredLogs.length > 0 ? (
        <div className="space-y-1 max-h-[60vh] overflow-y-auto no-scrollbar">
          {filteredLogs.map(log => (
            <div
              key={log.id}
              className="flex gap-2 py-1.5 px-3 rounded-lg hover:bg-white/3"
            >
              <span className="text-[10px] text-nora-text-tertiary font-mono whitespace-nowrap mt-0.5">
                {formatTime(log.timestamp)}
              </span>
              <span
                className="text-[10px] font-bold uppercase mt-0.5 whitespace-nowrap"
                style={{ color: LEVEL_COLORS[log.level] }}
              >
                {log.level}
              </span>
              <span className="text-[10px] text-nora-text-tertiary uppercase mt-0.5 whitespace-nowrap">
                {log.category}
              </span>
              <span className="text-xs text-nora-text font-mono leading-relaxed break-all">
                {redactSecrets(log.message)}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<ScrollText size={40} />}
          title="No logs"
          description="Log entries will appear here when you connect or perform actions."
        />
      )}

      {/* Redaction Notice */}
      <GlassCard className="p-3 mt-4">
        <p className="text-xs text-nora-text-tertiary">
          🔒 Secrets are automatically redacted. Passwords, private keys, and tokens are never displayed in logs.
        </p>
      </GlassCard>
    </div>
  );
}
