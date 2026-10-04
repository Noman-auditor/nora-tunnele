import React, { useState } from 'react';
import { Plus, Search, X, ChevronDown, Server } from 'lucide-react';
import { useStore } from '../store';
import { GlassCard, ScreenHeader, ProfileCardRow, EmptyState } from '../components';
import type { Protocol, Core, Transport, SecurityOption } from '../types';
import {
  PROTOCOL_LABELS, CORE_LABELS, TRANSPORT_LABELS, SECURITY_LABELS,
  PROTOCOL_CATEGORIES,
  getAvailableCores, getAvailableTransports, getAvailableSecurity,
} from '../types';

interface ProfileFormData {
  name: string;
  protocol: Protocol;
  core: Core;
  transport: Transport;
  security: SecurityOption;
  serverAddress: string;
  port: number;
}

const defaultFormData = (): ProfileFormData => ({
  name: '',
  protocol: 'vless',
  core: 'xray',
  transport: 'tcp',
  security: 'none',
  serverAddress: '',
  port: 443,
});

export function ProfilesScreen() {
  const { state, connect, addProfile, deleteProfile, toggleFavorite } = useStore();
  const { profiles, activeProfile, connectionState } = state;

  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState<ProfileFormData>(defaultFormData());
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProfiles = profiles.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    PROTOCOL_LABELS[p.protocol].toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProtocolChange = (protocol: Protocol) => {
    const cores = getAvailableCores(protocol);
    const core = cores[0] || 'xray';
    const transports = getAvailableTransports(protocol, core);
    const transport = transports[0] || 'tcp';
    const securities = getAvailableSecurity(protocol, core);
    const security = securities[0] || 'none';
    setForm(prev => ({ ...prev, protocol, core, transport, security }));
  };

  const handleCoreChange = (core: Core) => {
    const transports = getAvailableTransports(form.protocol, core);
    const transport = transports[0] || 'tcp';
    const securities = getAvailableSecurity(form.protocol, core);
    const security = securities[0] || 'none';
    setForm(prev => ({ ...prev, core, transport, security }));
  };

  const availableCores = getAvailableCores(form.protocol);
  const availableTransports = getAvailableTransports(form.protocol, form.core);
  const availableSecurity = getAvailableSecurity(form.protocol, form.core);

  const handleCreate = () => {
    if (!form.name.trim() || !form.serverAddress.trim()) return;
    addProfile(
      form.name.trim(),
      form.protocol,
      form.core,
      form.transport,
      form.security,
      form.serverAddress.trim(),
      form.port,
    );
    setForm(defaultFormData());
    setShowCreate(false);
  };

  if (showCreate) {
    return (
      <div className="animate-fade-in">
        <ScreenHeader
          title="Create Profile"
          subtitle="Configure a new tunnel profile"
          action={
            <button onClick={() => { setShowCreate(false); setForm(defaultFormData()); }} className="p-2 rounded-lg hover:bg-white/5">
              <X size={20} className="text-nora-text-tertiary" />
            </button>
          }
        />

        {/* Name */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-nora-text-tertiary uppercase tracking-wider mb-2 block">Profile Name</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Singapore"
              className="w-full px-4 py-3 rounded-xl glass border border-nora-border bg-transparent text-nora-text placeholder-nora-text-tertiary focus:outline-none focus:border-nora-accent/30"
            />
          </div>

          {/* Protocol */}
          <div>
            <label className="text-xs font-semibold text-nora-text-tertiary uppercase tracking-wider mb-2 block">Protocol</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(PROTOCOL_CATEGORIES).map(([catKey, cat]) => (
                <React.Fragment key={catKey}>
                  {cat.protocols.slice(0, 4).map(proto => (
                    <button
                      key={proto}
                      onClick={() => handleProtocolChange(proto)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        form.protocol === proto
                          ? 'glass-accent text-nora-accent'
                          : 'glass text-nora-text-secondary hover:bg-white/5'
                      }`}
                    >
                      {PROTOCOL_LABELS[proto]}
                    </button>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Core */}
          <div>
            <label className="text-xs font-semibold text-nora-text-tertiary uppercase tracking-wider mb-2 block">Core</label>
            <div className="flex gap-2 flex-wrap">
              {availableCores.map(core => (
                <button
                  key={core}
                  onClick={() => handleCoreChange(core)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                    form.core === core
                      ? 'glass-accent text-nora-accent'
                      : 'glass text-nora-text-secondary hover:bg-white/5'
                  }`}
                >
                  {CORE_LABELS[core]}
                </button>
              ))}
              {availableCores.length === 0 && (
                <p className="text-xs text-nora-text-tertiary">No core available for this protocol</p>
              )}
            </div>
          </div>

          {/* Transport */}
          <div>
            <label className="text-xs font-semibold text-nora-text-tertiary uppercase tracking-wider mb-2 block">Transport</label>
            <div className="flex gap-2 flex-wrap">
              {availableTransports.map(t => (
                <button
                  key={t}
                  onClick={() => setForm(prev => ({ ...prev, transport: t }))}
                  className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    form.transport === t
                      ? 'glass-accent text-nora-accent'
                      : 'glass text-nora-text-secondary hover:bg-white/5'
                  }`}
                >
                  {TRANSPORT_LABELS[t]}
                </button>
              ))}
            </div>
          </div>

          {/* Security */}
          <div>
            <label className="text-xs font-semibold text-nora-text-tertiary uppercase tracking-wider mb-2 block">Security</label>
            <div className="flex gap-2 flex-wrap">
              {availableSecurity.map(s => (
                <button
                  key={s}
                  onClick={() => setForm(prev => ({ ...prev, security: s }))}
                  className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    form.security === s
                      ? 'glass-accent text-nora-accent'
                      : 'glass text-nora-text-secondary hover:bg-white/5'
                  }`}
                >
                  {SECURITY_LABELS[s]}
                </button>
              ))}
            </div>
          </div>

          {/* Server Address */}
          <div>
            <label className="text-xs font-semibold text-nora-text-tertiary uppercase tracking-wider mb-2 block">Server Address</label>
            <input
              type="text"
              value={form.serverAddress}
              onChange={e => setForm(prev => ({ ...prev, serverAddress: e.target.value }))}
              placeholder="e.g., example.com"
              className="w-full px-4 py-3 rounded-xl glass border border-nora-border bg-transparent text-nora-text placeholder-nora-text-tertiary focus:outline-none focus:border-nora-accent/30"
            />
          </div>

          {/* Port */}
          <div>
            <label className="text-xs font-semibold text-nora-text-tertiary uppercase tracking-wider mb-2 block">Port</label>
            <input
              type="number"
              value={form.port}
              onChange={e => setForm(prev => ({ ...prev, port: parseInt(e.target.value) || 443 }))}
              className="w-full px-4 py-3 rounded-xl glass border border-nora-border bg-transparent text-nora-text placeholder-nora-text-tertiary focus:outline-none focus:border-nora-accent/30"
            />
          </div>

          {/* Capability Warning */}
          <GlassCard accent="warning" className="p-4">
            <p className="text-xs text-yellow-400">
              ⚠ {CORE_LABELS[form.core]} core is not available in this build. Real tunnel functionality requires native Android library integration.
            </p>
          </GlassCard>

          {/* Create Button */}
          <button
            onClick={handleCreate}
            disabled={!form.name.trim() || !form.serverAddress.trim()}
            className={`connect-btn w-full py-4 rounded-2xl text-white font-bold text-base tracking-wide flex items-center justify-center gap-2 ${
              !form.name.trim() || !form.serverAddress.trim() ? 'opacity-40 cursor-not-allowed' : ''
            }`}
          >
            <Plus size={20} />
            CREATE PROFILE
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <ScreenHeader
        title="My Profiles"
        subtitle={`${profiles.length} profile${profiles.length !== 1 ? 's' : ''}`}
        action={
          <button
            onClick={() => setShowCreate(true)}
            className="p-2 rounded-xl glass-accent hover:bg-nora-accent/20 transition-colors"
          >
            <Plus size={18} className="text-nora-accent" />
          </button>
        }
      />

      {/* Search */}
      {profiles.length > 0 && (
        <div className="relative mb-4">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-nora-text-tertiary" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search profiles..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl glass border border-nora-border bg-transparent text-sm text-nora-text placeholder-nora-text-tertiary focus:outline-none focus:border-nora-accent/30"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X size={14} className="text-nora-text-tertiary" />
            </button>
          )}
        </div>
      )}

      {/* Profile List */}
      {filteredProfiles.length > 0 ? (
        <div className="space-y-3">
          {filteredProfiles.map(p => (
            <ProfileCardRow
              key={p.id}
              name={p.name}
              protocol={p.protocol}
              core={p.core}
              transport={p.transport}
              server={p.serverAddress}
              favorite={p.favorite}
              isConnected={activeProfile?.id === p.id && connectionState === 'CONNECTED'}
              onConnect={() => connect(p)}
              onFavorite={() => toggleFavorite(p.id)}
              onDelete={() => deleteProfile(p.id)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Server size={48} />}
          title={profiles.length === 0 ? 'No profiles yet' : 'No matching profiles'}
          description={profiles.length === 0
            ? 'Import a configuration or create your first tunnel profile.'
            : 'Try a different search term.'
          }
          action={
            <button
              onClick={() => setShowCreate(true)}
              className="px-6 py-3 rounded-xl glass-accent text-nora-accent font-semibold text-sm flex items-center gap-2"
            >
              <Plus size={16} />
              Add Profile
            </button>
          }
        />
      )}

      {/* Import Config */}
      {profiles.length > 0 && (
        <GlassCard className="p-4 mt-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl glass-purple flex items-center justify-center">
              <Server size={18} className="text-nora-purple" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-nora-text">Import Configuration</p>
              <p className="text-xs text-nora-text-tertiary">.ovpn, WireGuard, Xray JSON, URI, QR</p>
            </div>
            <ChevronDown size={16} className="text-nora-text-tertiary" />
          </div>
        </GlassCard>
      )}
    </div>
  );
}
