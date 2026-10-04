import React from 'react';
import {
  Home, Users, Route, FlaskConical, BarChart3, ScrollText, Shield, Settings,
  ChevronRight, Star, Power, PowerOff, RefreshCw, Trash2, Server
} from 'lucide-react';
import type { ConnectionState, Screen, Protocol, Core, Transport } from './types';
import { CONNECTION_STATE_LABELS, CONNECTION_STATE_COLORS, PROTOCOL_LABELS, CORE_LABELS, TRANSPORT_LABELS } from './types';

// ============================================================
// Glass Card
// ============================================================

export function GlassCard({
  children,
  className = '',
  onClick,
  accent,
  hover = false,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  accent?: 'accent' | 'purple' | 'error' | 'warning' | 'none';
  hover?: boolean;
}) {
  const accentClass = accent === 'accent' ? 'glass-accent'
    : accent === 'purple' ? 'glass-purple'
    : accent === 'error' ? 'glass-error'
    : accent === 'warning' ? 'glass-warning'
    : 'glass';

  return (
    <div
      className={`rounded-2xl ${accentClass} ${hover ? 'glass-hover cursor-pointer transition-all duration-200' : ''} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

// ============================================================
// Status Dot
// ============================================================

export function StatusDot({ state, size = 'md' }: { state: ConnectionState; size?: 'sm' | 'md' | 'lg' }) {
  const color = CONNECTION_STATE_COLORS[state];
  const isActive = state === 'CONNECTED' || state === 'CONNECTING' || state === 'VALIDATING' || state === 'PREPARING' || state === 'RECONNECTING';

  const sizeClass = size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4';

  return (
    <div className="relative">
      <div
        className={`${sizeClass} rounded-full`}
        style={{ backgroundColor: color }}
      />
      {isActive && (
        <div
          className={`absolute inset-0 ${sizeClass} rounded-full animate-ping`}
          style={{ backgroundColor: color, opacity: 0.4 }}
        />
      )}
      {state === 'CONNECTED' && (
        <div
          className={`absolute -inset-1 ${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-6 h-6'} rounded-full`}
          style={{ boxShadow: `0 0 8px ${color}60` }}
        />
      )}
    </div>
  );
}

// ============================================================
// Connection State Badge
// ============================================================

export function ConnectionStateBadge({ state }: { state: ConnectionState }) {
  const color = CONNECTION_STATE_COLORS[state];
  const label = CONNECTION_STATE_LABELS[state];

  return (
    <div className="flex items-center gap-2">
      <StatusDot state={state} />
      <span className="text-sm font-semibold tracking-wide" style={{ color }}>
        {label.toUpperCase()}
      </span>
    </div>
  );
}

// ============================================================
// Connect Button
// ============================================================

export function ConnectButton({
  state,
  onConnect,
  onDisconnect,
  disabled = false,
}: {
  state: ConnectionState;
  onConnect?: () => void;
  onDisconnect?: () => void;
  disabled?: boolean;
}) {
  const isConnecting = ['VALIDATING', 'PREPARING', 'CONNECTING', 'RECONNECTING'].includes(state);
  const isConnected = state === 'CONNECTED';
  const isDisconnecting = state === 'DISCONNECTING';

  if (isConnected) {
    return (
      <button
        onClick={onDisconnect}
        className="disconnect-btn w-full py-4 rounded-2xl text-white font-bold text-lg tracking-wide flex items-center justify-center gap-3"
      >
        <PowerOff size={22} />
        DISCONNECT
      </button>
    );
  }

  if (isConnecting || isDisconnecting) {
    return (
      <button
        disabled
        className="w-full py-4 rounded-2xl font-bold text-lg tracking-wide flex items-center justify-center gap-3 glass border border-nora-border text-nora-text-secondary cursor-wait"
      >
        <RefreshCw size={20} className="animate-spin" />
        {isConnecting ? 'CONNECTING...' : 'DISCONNECTING...'}
      </button>
    );
  }

  return (
    <button
      onClick={onConnect}
      disabled={disabled}
      className={`connect-btn w-full py-4 rounded-2xl text-white font-bold text-lg tracking-wide flex items-center justify-center gap-3 ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
    >
      <Power size={22} />
      CONNECT
    </button>
  );
}

// ============================================================
// Screen Header
// ============================================================

export function ScreenHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-nora-text">{title}</h1>
        {action}
      </div>
      {subtitle && <p className="text-sm text-nora-text-tertiary mt-1">{subtitle}</p>}
    </div>
  );
}

// ============================================================
// Stat Item
// ============================================================

export function StatItem({ label, value, icon, color }: { label: string; value: string; icon?: React.ReactNode; color?: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      {icon && <div style={{ color: color ?? '#94a3b8' }}>{icon}</div>}
      <span className="text-lg font-bold text-nora-text">{value}</span>
      <span className="text-xs text-nora-text-tertiary uppercase tracking-wider">{label}</span>
    </div>
  );
}

// ============================================================
// Profile Card
// ============================================================

export function ProfileCardRow({
  name,
  protocol,
  core,
  transport,
  server,
  favorite,
  isConnected,
  onConnect,
  onFavorite,
  onDelete,
}: {
  name: string;
  protocol: Protocol;
  core: Core;
  transport: Transport;
  server?: string;
  favorite: boolean;
  isConnected?: boolean;
  onConnect?: () => void;
  onFavorite?: () => void;
  onDelete?: () => void;
}) {
  return (
    <GlassCard hover className="p-4" onClick={onConnect}>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isConnected ? 'glass-accent' : 'glass'}`}>
          <Server size={18} style={{ color: isConnected ? '#00d4aa' : '#94a3b8' }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {favorite && <Star size={14} className="text-nora-warning fill-nora-warning" />}
            <span className="font-semibold text-nora-text truncate">{name}</span>
          </div>
          <div className="text-xs text-nora-text-tertiary mt-0.5">
            {PROTOCOL_LABELS[protocol]} • {CORE_LABELS[core]} • {TRANSPORT_LABELS[transport]}
          </div>
          {server && <div className="text-xs text-nora-text-tertiary mt-0.5 truncate">{server}</div>}
        </div>
        <div className="flex items-center gap-1">
          {onFavorite && (
            <button
              onClick={(e) => { e.stopPropagation(); onFavorite(); }}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <Star size={16} className={favorite ? 'text-nora-warning fill-nora-warning' : 'text-nora-text-tertiary'} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <Trash2 size={16} className="text-nora-text-tertiary" />
            </button>
          )}
          <ChevronRight size={16} className="text-nora-text-tertiary" />
        </div>
      </div>
    </GlassCard>
  );
}

// ============================================================
// Section Label
// ============================================================

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-semibold uppercase tracking-wider text-nora-text-tertiary">
      {children}
    </span>
  );
}

// ============================================================
// Chip / Badge
// ============================================================

export function Chip({ children, color = 'default' }: { children: React.ReactNode; color?: 'default' | 'accent' | 'error' | 'warning' }) {
  const bgClass = color === 'accent' ? 'bg-nora-accent-dim text-nora-accent'
    : color === 'error' ? 'bg-red-500/15 text-red-400'
    : color === 'warning' ? 'bg-yellow-500/15 text-yellow-400'
    : 'bg-white/5 text-nora-text-secondary';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium ${bgClass}`}>
      {children}
    </span>
  );
}

// ============================================================
// Bottom Navigation
// ============================================================

const NAV_ITEMS: { screen: Screen; label: string; icon: React.ReactNode }[] = [
  { screen: 'home', label: 'Home', icon: <Home size={20} /> },
  { screen: 'profiles', label: 'Profiles', icon: <Users size={20} /> },
  { screen: 'routing', label: 'Routing', icon: <Route size={20} /> },
  { screen: 'lab', label: 'Lab', icon: <FlaskConical size={20} /> },
  { screen: 'statistics', label: 'Stats', icon: <BarChart3 size={20} /> },
  { screen: 'logs', label: 'Logs', icon: <ScrollText size={20} /> },
  { screen: 'security', label: 'Security', icon: <Shield size={20} /> },
  { screen: 'settings', label: 'Settings', icon: <Settings size={20} /> },
];

export function BottomNav({ current, onNavigate }: { current: Screen; onNavigate: (s: Screen) => void }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-strong z-50 safe-bottom">
      <div className="max-w-lg mx-auto flex items-center justify-around py-2 px-1">
        {NAV_ITEMS.map(item => {
          const isActive = current === item.screen;
          return (
            <button
              key={item.screen}
              onClick={() => onNavigate(item.screen)}
              className={`flex flex-col items-center gap-0.5 py-1.5 px-2 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-nora-accent'
                  : 'text-nora-text-tertiary hover:text-nora-text-secondary'
              }`}
            >
              <div className={isActive ? 'relative' : ''}>
                {item.icon}
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-nora-accent" />
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

// ============================================================
// Empty State
// ============================================================

export function EmptyState({ icon, title, description, action }: { icon?: React.ReactNode; title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      {icon && <div className="mb-4 text-nora-text-tertiary">{icon}</div>}
      <h3 className="text-lg font-semibold text-nora-text mb-2">{title}</h3>
      <p className="text-sm text-nora-text-tertiary max-w-xs leading-relaxed">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

// ============================================================
// Format helpers
// ============================================================

export function formatSpeed(bytesPerSec: number): string {
  if (bytesPerSec === 0) return '0 B/s';
  if (bytesPerSec < 1024) return `${bytesPerSec.toFixed(0)} B/s`;
  if (bytesPerSec < 1024 * 1024) return `${(bytesPerSec / 1024).toFixed(1)} KB/s`;
  if (bytesPerSec < 1024 * 1024 * 1024) return `${(bytesPerSec / (1024 * 1024)).toFixed(1)} MB/s`;
  return `${(bytesPerSec / (1024 * 1024 * 1024)).toFixed(2)} GB/s`;
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  if (bytes < 1024) return `${bytes.toFixed(0)} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export function formatUptime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}
