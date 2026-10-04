import React from 'react';
import {
  ArrowDown, ArrowUp, Clock, Zap, Globe, Shield, Server, AlertCircle,
  ChevronRight
} from 'lucide-react';
import { useStore } from '../store';
import {
  GlassCard, ConnectionStateBadge, ConnectButton, StatItem,
  formatSpeed, formatUptime
} from '../components';
import { PROTOCOL_LABELS, CORE_LABELS, TRANSPORT_LABELS } from '../types';

export function HomeScreen() {
  const { state, connect, disconnect, navigate } = useStore();
  const {
    connectionState,
    activeProfile,
    downloadSpeed,
    uploadSpeed,
    latency,
    uptime,
    connectionError,
    profiles,
  } = state;

  const isConnected = connectionState === 'CONNECTED';
  const isDisconnected = ['IDLE', 'DISCONNECTED', 'ERROR'].includes(connectionState);
  const hasProfiles = profiles.length > 0;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8 pt-2">
        <h1 className="text-3xl font-black tracking-tight text-gradient-accent">
          NORA TUNNEL
        </h1>
        <p className="text-sm text-nora-text-tertiary mt-1 tracking-widest">
          Secure. Private. Connected.
        </p>
      </div>

      {/* Main Connection Card */}
      <GlassCard accent={isConnected ? 'accent' : connectionState === 'ERROR' ? 'error' : 'none'} className="p-6 mb-4">
        {/* Status */}
        <div className="flex items-center justify-between mb-6">
          <ConnectionStateBadge state={connectionState} />
          {isConnected && activeProfile && (
            <span className="text-xs text-nora-text-tertiary">
              {activeProfile.name}
            </span>
          )}
        </div>

        {/* Connection Details (only when connected) */}
        {isConnected && activeProfile && (
          <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
            <div className="flex flex-col">
              <span className="text-nora-text-tertiary text-xs">Protocol</span>
              <span className="text-nora-text font-medium">{PROTOCOL_LABELS[activeProfile.protocol]}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-nora-text-tertiary text-xs">Core</span>
              <span className="text-nora-text font-medium">{CORE_LABELS[activeProfile.core]}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-nora-text-tertiary text-xs">Transport</span>
              <span className="text-nora-text font-medium">{TRANSPORT_LABELS[activeProfile.transport]}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-nora-text-tertiary text-xs">Server</span>
              <span className="text-nora-text font-medium truncate">{activeProfile.serverAddress}</span>
            </div>
            {latency !== null && (
              <div className="flex flex-col">
                <span className="text-nora-text-tertiary text-xs">Latency</span>
                <span className="text-nora-text font-medium">{latency} ms</span>
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-nora-text-tertiary text-xs">Uptime</span>
              <span className="text-nora-text font-medium">{formatUptime(uptime)}</span>
            </div>
          </div>
        )}

        {/* Traffic Stats (only when connected with real data) */}
        {isConnected && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <StatItem
              label="Download"
              value={formatSpeed(downloadSpeed)}
              icon={<ArrowDown size={16} />}
              color="#3b82f6"
            />
            <StatItem
              label="Upload"
              value={formatSpeed(uploadSpeed)}
              icon={<ArrowUp size={16} />}
              color="#8b5cf6"
            />
            <StatItem
              label="Uptime"
              value={formatUptime(uptime)}
              icon={<Clock size={16} />}
              color="#94a3b8"
            />
          </div>
        )}

        {/* Error Display */}
        {connectionState === 'ERROR' && connectionError && (
          <div className="mb-6 p-4 rounded-xl glass-error">
            <div className="flex items-start gap-3">
              <AlertCircle size={18} className="text-nora-error flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-400">Connection Failed</p>
                <p className="text-xs text-red-400/80 mt-1 leading-relaxed">{connectionError}</p>
                <p className="text-xs text-nora-text-tertiary mt-2">
                  Core libraries must be integrated on Android for real tunnel functionality.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* No Profile Selected */}
        {isDisconnected && !activeProfile && !connectionError && (
          <div className="mb-6 text-center py-4">
            {!hasProfiles ? (
              <>
                <p className="text-sm text-nora-text-tertiary mb-1">No configured server</p>
                <p className="text-xs text-nora-text-tertiary">
                  Create a profile or import a configuration to get started.
                </p>
              </>
            ) : (
              <p className="text-sm text-nora-text-tertiary">
                Select a profile to connect
              </p>
            )}
          </div>
        )}

        {/* Connect / Disconnect */}
        {hasProfiles ? (
          <ConnectButton
            state={connectionState}
            onConnect={() => {
              if (profiles.length > 0) {
                connect(profiles[0]);
              }
            }}
            onDisconnect={disconnect}
            disabled={!hasProfiles}
          />
        ) : (
          <button
            onClick={() => navigate('profiles')}
            className="w-full py-4 rounded-2xl font-semibold text-nora-accent glass border border-nora-accent/20 flex items-center justify-center gap-2 hover:bg-nora-accent/10 transition-colors"
          >
            <Plus size={20} />
            CREATE PROFILE TO CONNECT
          </button>
        )}
      </GlassCard>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Security Status */}
        <GlassCard className="p-4" onClick={() => navigate('security')}>
          <div className="flex items-center gap-2 mb-2">
            <Shield size={16} className={isConnected ? 'text-nora-accent' : 'text-nora-text-tertiary'} />
            <span className="text-xs font-semibold text-nora-text-tertiary uppercase">Security</span>
          </div>
          <p className="text-sm font-semibold text-nora-text">
            {isConnected ? 'Protected' : 'Unprotected'}
          </p>
          <p className="text-xs text-nora-text-tertiary mt-0.5">
            {isConnected ? 'VPN tunnel active' : 'No active tunnel'}
          </p>
        </GlassCard>

        {/* Network */}
        <GlassCard className="p-4" onClick={() => navigate('lab')}>
          <div className="flex items-center gap-2 mb-2">
            <Globe size={16} className="text-nora-text-tertiary" />
            <span className="text-xs font-semibold text-nora-text-tertiary uppercase">Network</span>
          </div>
          <p className="text-sm font-semibold text-nora-text">
            {isConnected ? 'Tunneled' : 'Direct'}
          </p>
          <p className="text-xs text-nora-text-tertiary mt-0.5">
            {isConnected ? 'Traffic via tunnel' : 'Direct connection'}
          </p>
        </GlassCard>
      </div>

      {/* Recent Profiles */}
      {hasProfiles && (
        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-nora-text-tertiary uppercase tracking-wider">
              Profiles
            </span>
            <button
              onClick={() => navigate('profiles')}
              className="text-xs text-nora-accent flex items-center gap-1"
            >
              View all <ChevronRight size={12} />
            </button>
          </div>
          <div className="space-y-2">
            {profiles.slice(0, 3).map(p => (
              <div
                key={p.id}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer transition-colors"
                onClick={() => connect(p)}
              >
                <div className="w-8 h-8 rounded-lg glass flex items-center justify-center">
                  <Server size={14} className="text-nora-text-tertiary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-nora-text truncate">{p.name}</p>
                  <p className="text-xs text-nora-text-tertiary">
                    {PROTOCOL_LABELS[p.protocol]} • {CORE_LABELS[p.core]}
                  </p>
                </div>
                <Zap size={14} className="text-nora-text-tertiary" />
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Build APK Card */}
      <GlassCard accent="accent" className="p-4 mt-4" onClick={() => navigate('settings')}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl glass-accent flex items-center justify-center">
            <Zap size={18} className="text-nora-accent" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-nora-text">Build Android APK</p>
            <p className="text-xs text-nora-text-tertiary">Push to GitHub → Actions → Download APK</p>
          </div>
          <ChevronRight size={16} className="text-nora-text-tertiary" />
        </div>
      </GlassCard>

      {/* Protocol Availability Notice */}
      <GlassCard className="p-4 mt-4" accent="warning">
        <div className="flex items-start gap-3">
          <AlertCircle size={16} className="text-nora-warning flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-yellow-400">Web Prototype</p>
            <p className="text-xs text-yellow-400/70 mt-1 leading-relaxed">
              This is an interactive UI prototype. Real tunnel functionality requires native Android core integration (WireGuard, Xray, sing-box, etc.).
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

function Plus({ size, ...props }: { size: number } & React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 12h14" /><path d="M12 5v14" />
    </svg>
  );
}
