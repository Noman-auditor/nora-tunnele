import React, { useState } from 'react';
import { Plus, Trash2, Globe, Hash, Smartphone, MapPin, Network } from 'lucide-react';
import { useStore } from '../store';
import { GlassCard, ScreenHeader, EmptyState, Chip } from '../components';
import type { RoutingMode, RuleType, RuleAction, RoutingRule } from '../types';

const ROUTING_MODES: { mode: RoutingMode; label: string; desc: string }[] = [
  { mode: 'global', label: 'Global', desc: 'All traffic through tunnel' },
  { mode: 'proxy', label: 'Proxy', desc: 'Route by rules (default)' },
  { mode: 'direct', label: 'Direct', desc: 'Bypass tunnel, direct connection' },
  { mode: 'block', label: 'Block', desc: 'Block all network access' },
  { mode: 'rule-based', label: 'Rule Based', desc: 'Custom routing rules' },
];

const RULE_TYPES: { type: RuleType; label: string; icon: React.ReactNode }[] = [
  { type: 'domain', label: 'Domain', icon: <Globe size={14} /> },
  { type: 'ip', label: 'IP/CIDR', icon: <Hash size={14} /> },
  { type: 'app', label: 'Application', icon: <Smartphone size={14} /> },
  { type: 'dns', label: 'DNS', icon: <Network size={14} /> },
  { type: 'geo', label: 'Geo', icon: <MapPin size={14} /> },
];

const RULE_ACTIONS: { action: RuleAction; label: string; color: string }[] = [
  { action: 'proxy', label: 'Proxy', color: '#00d4aa' },
  { action: 'direct', label: 'Direct', color: '#3b82f6' },
  { action: 'block', label: 'Block', color: '#ef4444' },
];

export function RoutingScreen() {
  const { state, dispatch } = useStore();
  const { routingMode, routingRules } = state;

  const [showAddRule, setShowAddRule] = useState(false);
  const [newRuleType, setNewRuleType] = useState<RuleType>('domain');
  const [newRulePattern, setNewRulePattern] = useState('');
  const [newRuleAction, setNewRuleAction] = useState<RuleAction>('proxy');

  const handleAddRule = () => {
    if (!newRulePattern.trim()) return;
    const rule: RoutingRule = {
      id: crypto.randomUUID(),
      type: newRuleType,
      pattern: newRulePattern.trim(),
      action: newRuleAction,
      enabled: true,
      priority: routingRules.length + 1,
    };
    dispatch({ type: 'ADD_ROUTING_RULE', rule });
    setNewRulePattern('');
    setShowAddRule(false);
  };

  return (
    <div className="animate-fade-in">
      <ScreenHeader title="Routing Studio" subtitle="Configure traffic routing rules" />

      {/* Routing Mode */}
      <div className="mb-6">
        <span className="text-xs font-semibold text-nora-text-tertiary uppercase tracking-wider mb-3 block">
          Routing Mode
        </span>
        <div className="space-y-2">
          {ROUTING_MODES.map(m => (
            <GlassCard
              key={m.mode}
              hover
              className="p-4"
              accent={routingMode === m.mode ? 'accent' : undefined}
              onClick={() => dispatch({ type: 'SET_ROUTING_MODE', mode: m.mode })}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  routingMode === m.mode ? 'border-nora-accent' : 'border-nora-text-tertiary/30'
                }`}>
                  {routingMode === m.mode && (
                    <div className="w-2.5 h-2.5 rounded-full bg-nora-accent" />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${routingMode === m.mode ? 'text-nora-accent' : 'text-nora-text'}`}>
                    {m.label}
                  </p>
                  <p className="text-xs text-nora-text-tertiary">{m.desc}</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Routing Rules */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-nora-text-tertiary uppercase tracking-wider">
            Rules ({routingRules.length})
          </span>
          <button
            onClick={() => setShowAddRule(!showAddRule)}
            className="p-1.5 rounded-lg glass-accent hover:bg-nora-accent/20 transition-colors"
          >
            <Plus size={14} className="text-nora-accent" />
          </button>
        </div>

        {/* Add Rule Form */}
        {showAddRule && (
          <GlassCard accent="accent" className="p-4 mb-3">
            <div className="space-y-3">
              {/* Rule Type */}
              <div className="flex gap-2 flex-wrap">
                {RULE_TYPES.map(rt => (
                  <button
                    key={rt.type}
                    onClick={() => setNewRuleType(rt.type)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      newRuleType === rt.type
                        ? 'glass-accent text-nora-accent'
                        : 'glass text-nora-text-secondary'
                    }`}
                  >
                    {rt.icon} {rt.label}
                  </button>
                ))}
              </div>

              {/* Pattern */}
              <input
                type="text"
                value={newRulePattern}
                onChange={e => setNewRulePattern(e.target.value)}
                placeholder={newRuleType === 'domain' ? 'example.com' : newRuleType === 'ip' ? '10.0.0.0/8' : 'pattern'}
                className="w-full px-3 py-2 rounded-xl glass border border-nora-border bg-transparent text-sm text-nora-text placeholder-nora-text-tertiary focus:outline-none focus:border-nora-accent/30"
              />

              {/* Action */}
              <div className="flex gap-2">
                {RULE_ACTIONS.map(ra => (
                  <button
                    key={ra.action}
                    onClick={() => setNewRuleAction(ra.action)}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                      newRuleAction === ra.action
                        ? 'border'
                        : 'glass text-nora-text-secondary'
                    }`}
                    style={newRuleAction === ra.action ? {
                      backgroundColor: `${ra.color}15`,
                      borderColor: `${ra.color}40`,
                      color: ra.color,
                    } : {}}
                  >
                    {ra.label}
                  </button>
                ))}
              </div>

              <button
                onClick={handleAddRule}
                disabled={!newRulePattern.trim()}
                className={`w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-nora-accent/80 hover:bg-nora-accent transition-colors ${
                  !newRulePattern.trim() ? 'opacity-40 cursor-not-allowed' : ''
                }`}
              >
                Add Rule
              </button>
            </div>
          </GlassCard>
        )}

        {/* Rule List */}
        {routingRules.length > 0 ? (
          <div className="space-y-2">
            {routingRules.map(rule => {
              const actionInfo = RULE_ACTIONS.find(a => a.action === rule.action);
              const typeInfo = RULE_TYPES.find(t => t.type === rule.type);
              return (
                <GlassCard key={rule.id} className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg glass flex items-center justify-center text-nora-text-tertiary">
                      {typeInfo?.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-nora-text font-medium truncate">{rule.pattern}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Chip>{typeInfo?.label}</Chip>
                        <Chip color={rule.action === 'proxy' ? 'accent' : rule.action === 'block' ? 'error' : 'default'}>
                          {actionInfo?.label}
                        </Chip>
                      </div>
                    </div>
                    <button
                      onClick={() => dispatch({ type: 'TOGGLE_ROUTING_RULE', id: rule.id })}
                      className="p-1.5 rounded-lg hover:bg-white/5"
                    >
                      <div className={`w-3 h-3 rounded-sm ${rule.enabled ? 'bg-nora-accent' : 'bg-nora-text-tertiary/30'}`} />
                    </button>
                    <button
                      onClick={() => dispatch({ type: 'DELETE_ROUTING_RULE', id: rule.id })}
                      className="p-1.5 rounded-lg hover:bg-white/5"
                    >
                      <Trash2 size={14} className="text-nora-text-tertiary" />
                    </button>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={<Globe size={40} />}
            title="No routing rules"
            description="Add rules to control how traffic is routed through the tunnel."
          />
        )}
      </div>

      {/* Per-App VPN Section */}
      <div className="mt-6">
        <span className="text-xs font-semibold text-nora-text-tertiary uppercase tracking-wider mb-3 block">
          Application Routing
        </span>
        <GlassCard className="p-4">
          <div className="space-y-3">
            {['All applications', 'Selected applications', 'Excluded applications'].map((label, i) => (
              <div key={label} className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  i === 0 ? 'border-nora-accent' : 'border-nora-text-tertiary/30'
                }`}>
                  {i === 0 && <div className="w-2.5 h-2.5 rounded-full bg-nora-accent" />}
                </div>
                <span className={`text-sm ${i === 0 ? 'text-nora-accent' : 'text-nora-text'}`}>{label}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-nora-text-tertiary mt-3">
            Per-app VPN requires Android VPN application-selection APIs.
          </p>
        </GlassCard>
      </div>
    </div>
  );
}
