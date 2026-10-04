import { Shield, Lock, Globe, Smartphone, AlertTriangle, CheckCircle, XCircle, HelpCircle, FileText } from 'lucide-react';
import { useStore } from '../store';
import { GlassCard, ScreenHeader, Chip } from '../components';

interface SecurityItemProps {
  label: string;
  status: 'active' | 'inactive' | 'unknown' | 'not-configured';
  detail?: string;
  icon: React.ReactNode;
}

function SecurityItem({ label, status, detail, icon }: SecurityItemProps) {
  const statusConfig = {
    active: { color: '#00d4aa', icon: <CheckCircle size={14} />, label: 'ACTIVE' },
    inactive: { color: '#ef4444', icon: <XCircle size={14} />, label: 'INACTIVE' },
    unknown: { color: '#64748b', icon: <HelpCircle size={14} />, label: 'UNKNOWN' },
    'not-configured': { color: '#f59e0b', icon: <AlertTriangle size={14} />, label: 'NOT CONFIGURED' },
  };

  const cfg = statusConfig[status];

  return (
    <GlassCard className="p-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl glass flex items-center justify-center text-nora-text-tertiary">
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-nora-text">{label}</p>
          {detail && <p className="text-xs text-nora-text-tertiary mt-0.5">{detail}</p>}
        </div>
        <div className="flex items-center gap-1.5" style={{ color: cfg.color }}>
          {cfg.icon}
          <span className="text-xs font-semibold">{cfg.label}</span>
        </div>
      </div>
    </GlassCard>
  );
}

export function SecurityScreen() {
  const { state } = useStore();
  const { connectionState } = state;
  const isConnected = connectionState === 'CONNECTED';

  return (
    <div className="animate-fade-in">
      <ScreenHeader title="Security Center" subtitle="Review your security and privacy state" />

      {/* Overall Status */}
      <GlassCard accent={isConnected ? 'accent' : 'error'} className="p-5 mb-4">
        <div className="flex items-center gap-3 mb-2">
          <Shield size={24} className={isConnected ? 'text-nora-accent' : 'text-nora-error'} />
          <div>
            <h2 className="text-lg font-bold text-nora-text">
              {isConnected ? 'Protected' : 'Unprotected'}
            </h2>
            <p className="text-xs text-nora-text-tertiary">
              {isConnected ? 'VPN tunnel is active and securing your connection' : 'No active VPN tunnel — traffic is not protected'}
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Security Items */}
      <div className="space-y-3 mb-6">
        <SecurityItem
          label="VPN Interface"
          status={isConnected ? 'active' : 'inactive'}
          detail={isConnected ? 'Android VpnService interface active' : 'No VPN interface established'}
          icon={<Smartphone size={18} />}
        />
        <SecurityItem
          label="Encryption"
          status={isConnected ? 'unknown' : 'inactive'}
          detail={isConnected ? 'Depends on protocol and configuration' : 'No active tunnel'}
          icon={<Lock size={18} />}
        />
        <SecurityItem
          label="DNS Protection"
          status={isConnected ? 'unknown' : 'not-configured'}
          detail={isConnected ? 'DNS routing through tunnel' : 'Not configured — DNS may leak'}
          icon={<Globe size={18} />}
        />
        <SecurityItem
          label="IPv6"
          status="unknown"
          detail="Depends on tunnel configuration and server support"
          icon={<Globe size={18} />}
        />
        <SecurityItem
          label="Kill Switch"
          status="not-configured"
          detail="Block traffic without VPN — requires Android always-on VPN"
          icon={<Shield size={18} />}
        />
      </div>

      {/* Warnings */}
      <GlassCard accent="warning" className="p-4 mb-4">
        <div className="flex items-start gap-3">
          <AlertTriangle size={16} className="text-nora-warning flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-yellow-400">Important Notes</p>
            <ul className="text-xs text-yellow-400/70 mt-1 space-y-1 list-disc list-inside">
              <li>Do not claim "DNS leak protection" unless the actual tunnel implementation provides it</li>
              <li>Kill switch requires Android's always-on VPN setting</li>
              <li>Encryption status depends on the protocol and core used</li>
              <li>IPv6 handling depends on server and configuration support</li>
            </ul>
          </div>
        </div>
      </GlassCard>

      {/* Secure Storage */}
      <div className="mb-6">
        <span className="text-xs font-semibold text-nora-text-tertiary uppercase tracking-wider mb-3 block">
          Credential Storage
        </span>
        <GlassCard className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-nora-text">Private Keys</span>
              <Chip color="accent">Android Keystore</Chip>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-nora-text">Passwords</span>
              <Chip color="accent">Encrypted Storage</Chip>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-nora-text">Configuration</span>
              <Chip color="accent">Local Encrypted</Chip>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-nora-text">Telemetry</span>
              <Chip>None</Chip>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Diagnostics Export */}
      <div>
        <span className="text-xs font-semibold text-nora-text-tertiary uppercase tracking-wider mb-3 block">
          Diagnostics
        </span>
        <GlassCard hover className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl glass flex items-center justify-center">
              <FileText size={18} className="text-nora-text-tertiary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-nora-text">Export Diagnostics</p>
              <p className="text-xs text-nora-text-tertiary">Safe report — no secrets, keys, or personal data</p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
