import { useState } from 'react';
import {
  Palette, Wifi, Shield, Globe, Bell, ScrollText, Database, Stethoscope,
  Info, ChevronRight, Moon, Sun, Monitor, Package
} from 'lucide-react';
import { GlassCard, ScreenHeader } from '../components';
import { BuildInfoScreen } from './BuildInfoScreen';

interface SettingSectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

function SettingSection({ icon, title, children }: SettingSectionProps) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="text-nora-text-tertiary">{icon}</div>
        <span className="text-xs font-semibold text-nora-text-tertiary uppercase tracking-wider">{title}</span>
      </div>
      {children}
    </div>
  );
}

function SettingRow({ label, detail, onClick, action }: { label: string; detail?: string; onClick?: () => void; action?: React.ReactNode }) {
  return (
    <GlassCard hover={!!onClick} className="p-4" onClick={onClick}>
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <p className="text-sm text-nora-text">{label}</p>
          {detail && <p className="text-xs text-nora-text-tertiary mt-0.5">{detail}</p>}
        </div>
        {action || (onClick && <ChevronRight size={14} className="text-nora-text-tertiary" />)}
      </div>
    </GlassCard>
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`w-10 h-6 rounded-full transition-colors relative ${value ? 'bg-nora-accent' : 'bg-white/10'}`}
    >
      <div className={`absolute top-1 w-4 h-4 rounded-full transition-transform ${value ? 'translate-x-5 bg-white' : 'translate-x-1 bg-nora-text-tertiary'}`} />
    </button>
  );
}

export function SettingsScreen() {
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark');
  const [autoReconnect, setAutoReconnect] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [killSwitch, setKillSwitch] = useState(false);
  const [compactLayout, setCompactLayout] = useState(false);
  const [showBuildInfo, setShowBuildInfo] = useState(false);

  if (showBuildInfo) {
    return (
      <div className="animate-fade-in">
        <BuildInfoScreen />
        <button
          onClick={() => setShowBuildInfo(false)}
          className="mt-4 w-full py-3 rounded-xl glass text-nora-text-secondary text-sm font-medium hover:bg-white/5 transition-colors"
        >
          ← Back to Settings
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <ScreenHeader title="Settings" />

      {/* Appearance */}
      <SettingSection icon={<Palette size={16} />} title="Appearance">
        <div className="space-y-2">
          <GlassCard className="p-4">
            <p className="text-sm text-nora-text mb-3">Theme</p>
            <div className="flex gap-2">
              {[
                { value: 'dark' as const, icon: <Moon size={14} />, label: 'Dark' },
                { value: 'light' as const, icon: <Sun size={14} />, label: 'Light' },
                { value: 'system' as const, icon: <Monitor size={14} />, label: 'System' },
              ].map(t => (
                <button
                  key={t.value}
                  onClick={() => setTheme(t.value)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    theme === t.value
                      ? 'glass-accent text-nora-accent'
                      : 'glass text-nora-text-secondary'
                  }`}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
          </GlassCard>
          <SettingRow
            label="Compact Layout"
            detail="Reduce spacing for information-dense view"
            action={<Toggle value={compactLayout} onChange={() => setCompactLayout(!compactLayout)} />}
          />
        </div>
      </SettingSection>

      {/* Connection */}
      <SettingSection icon={<Wifi size={16} />} title="Connection">
        <div className="space-y-2">
          <SettingRow
            label="Auto Reconnect"
            detail="Automatically reconnect on connection loss"
            action={<Toggle value={autoReconnect} onChange={() => setAutoReconnect(!autoReconnect)} />}
          />
          <SettingRow
            label="Connection Timeout"
            detail="10 seconds"
            onClick={() => {}}
          />
          <SettingRow
            label="Retry Count"
            detail="3 attempts"
            onClick={() => {}}
          />
          <SettingRow
            label="Start on Boot"
            detail="Connect automatically when device starts"
            action={<Toggle value={false} onChange={() => {}} />}
          />
        </div>
      </SettingSection>

      {/* VPN */}
      <SettingSection icon={<Shield size={16} />} title="VPN">
        <div className="space-y-2">
          <SettingRow
            label="Kill Switch"
            detail="Block traffic without VPN (requires always-on VPN)"
            action={<Toggle value={killSwitch} onChange={() => setKillSwitch(!killSwitch)} />}
          />
          <SettingRow
            label="Always-on VPN"
            detail="Set Nora Tunnel as always-on VPN in Android settings"
            onClick={() => {}}
          />
          <SettingRow
            label="IPv6"
            detail="Enable IPv6 in VPN interface"
            action={<Toggle value={true} onChange={() => {}} />}
          />
        </div>
      </SettingSection>

      {/* DNS */}
      <SettingSection icon={<Globe size={16} />} title="DNS">
        <div className="space-y-2">
          <SettingRow
            label="DNS Mode"
            detail="System DNS"
            onClick={() => {}}
          />
          <SettingRow
            label="DNS over HTTPS"
            detail="Not configured"
            onClick={() => {}}
          />
          <SettingRow
            label="Block DNS Leaks"
            detail="Force all DNS through tunnel"
            action={<Toggle value={true} onChange={() => {}} />}
          />
        </div>
      </SettingSection>

      {/* Notifications */}
      <SettingSection icon={<Bell size={16} />} title="Notifications">
        <div className="space-y-2">
          <SettingRow
            label="Connection Notifications"
            detail="Show connection state in notification bar"
            action={<Toggle value={notifications} onChange={() => setNotifications(!notifications)} />}
          />
          <SettingRow
            label="Show Traffic in Notification"
            detail="Display real-time speed in notification"
            action={<Toggle value={true} onChange={() => {}} />}
          />
        </div>
      </SettingSection>

      {/* Logs */}
      <SettingSection icon={<ScrollText size={16} />} title="Logs">
        <div className="space-y-2">
          <SettingRow
            label="Log Level"
            detail="Info"
            onClick={() => {}}
          />
          <SettingRow
            label="Max Log Size"
            detail="1 MB"
            onClick={() => {}}
          />
          <SettingRow
            label="Redact Secrets"
            detail="Automatically redact passwords, keys, tokens"
            action={<Toggle value={true} onChange={() => {}} />}
          />
        </div>
      </SettingSection>

      {/* Storage */}
      <SettingSection icon={<Database size={16} />} title="Storage">
        <div className="space-y-2">
          <SettingRow
            label="Profile Storage"
            detail="Local encrypted database"
            onClick={() => {}}
          />
          <SettingRow
            label="Clear All Data"
            detail="Delete all profiles, history, and logs"
            onClick={() => {}}
          />
          <SettingRow
            label="Export Backup"
            detail="Export profiles and settings (no secrets)"
            onClick={() => {}}
          />
        </div>
      </SettingSection>

      {/* Diagnostics */}
      <SettingSection icon={<Stethoscope size={16} />} title="Diagnostics">
        <div className="space-y-2">
          <SettingRow
            label="Export Diagnostics"
            detail="Generate safe diagnostic report"
            onClick={() => {}}
          />
          <SettingRow
            label="Connection History"
            detail="View past connection sessions"
            onClick={() => {}}
          />
        </div>
      </SettingSection>

      {/* Build APK */}
      <SettingSection icon={<Package size={16} />} title="Build APK">
        <div className="space-y-2">
          <GlassCard accent="accent" className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <Package size={20} className="text-nora-accent" />
              <div>
                <p className="text-sm font-semibold text-nora-text">GitHub Actions Build</p>
                <p className="text-xs text-nora-text-tertiary">Auto-build APK on every push</p>
              </div>
            </div>
            <p className="text-xs text-nora-text-tertiary leading-relaxed">
              Push this repository to GitHub → Go to Actions → Run "Build Nora Tunnel APK" → Download APK artifact.
            </p>
          </GlassCard>
          <SettingRow
            label="View Full Build Instructions"
            detail="Step-by-step guide for APK creation"
            onClick={() => setShowBuildInfo(true)}
          />
        </div>
      </SettingSection>

      {/* About */}
      <SettingSection icon={<Info size={16} />} title="About">
        <div className="space-y-2">
          <SettingRow label="App Name" detail="Nora Tunnel" />
          <SettingRow label="Version" detail="1.0.0" />
          <SettingRow label="Package" detail="com.nora.tunnel" />
          <SettingRow label="Target" detail="Android 10+ (API 29+)" />
          <GlassCard className="p-4">
            <p className="text-xs text-nora-text-tertiary leading-relaxed">
              Nora Tunnel is a local-first, privacy-respecting VPN and tunnel client.
              No remote account required. No hidden telemetry. Your configurations
              and credentials stay on your device.
            </p>
          </GlassCard>
        </div>
      </SettingSection>
    </div>
  );
}
