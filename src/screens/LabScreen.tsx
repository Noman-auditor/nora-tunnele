import React, { useState } from 'react';
import { Zap, Globe, Network, Shield, FileText, Clock, CheckCircle, XCircle, MinusCircle, HelpCircle } from 'lucide-react';
import { GlassCard, ScreenHeader, Chip } from '../components';
import type { LabTool, TestStatus } from '../types';

const LAB_TOOLS: { tool: LabTool; label: string; icon: React.ReactNode; desc: string }[] = [
  { tool: 'ping', label: 'Ping Test', icon: <Zap size={16} />, desc: 'Test host reachability and latency' },
  { tool: 'dns', label: 'DNS Test', icon: <Globe size={16} />, desc: 'Query DNS resolution' },
  { tool: 'tcp', label: 'TCP Connectivity', icon: <Network size={16} />, desc: 'Test TCP connection to host:port' },
  { tool: 'udp', label: 'UDP Connectivity', icon: <Network size={16} />, desc: 'Test UDP reachability' },
  { tool: 'tls', label: 'TLS Test', icon: <Shield size={16} />, desc: 'Verify TLS certificate and handshake' },
  { tool: 'http', label: 'HTTP Connectivity', icon: <Globe size={16} />, desc: 'Test HTTP/HTTPS connection' },
  { tool: 'route', label: 'Route Test', icon: <Network size={16} />, desc: 'Trace route to host' },
  { tool: 'config', label: 'Config Validator', icon: <FileText size={16} />, desc: 'Validate tunnel configuration' },
];

function StatusIcon({ status }: { status: TestStatus }) {
  switch (status) {
    case 'pass': return <CheckCircle size={14} className="text-nora-accent" />;
    case 'fail': return <XCircle size={14} className="text-nora-error" />;
    case 'not-supported': return <MinusCircle size={14} className="text-nora-text-tertiary" />;
    case 'running': return <Clock size={14} className="text-nora-warning animate-spin" />;
    default: return <HelpCircle size={14} className="text-nora-text-tertiary" />;
  }
}

function StatusLabel({ status }: { status: TestStatus }) {
  const labels: Record<TestStatus, string> = {
    pass: 'PASS',
    fail: 'FAIL',
    'not-supported': 'NOT SUPPORTED',
    'not-tested': 'NOT TESTED',
    running: 'RUNNING',
  };
  const colors: Record<TestStatus, string> = {
    pass: '#00d4aa',
    fail: '#ef4444',
    'not-supported': '#64748b',
    'not-tested': '#64748b',
    running: '#f59e0b',
  };
  return <span className="text-xs font-semibold" style={{ color: colors[status] }}>{labels[status]}</span>;
}

export function LabScreen() {
  const [selectedTool, setSelectedTool] = useState<LabTool | null>(null);
  const [testTarget, setTestTarget] = useState('');
  const [testResults, setTestResults] = useState<Map<string, TestStatus>>(new Map());

  const runTest = (tool: LabTool) => {
    const key = `${tool}-${testTarget || 'default'}`;
    setTestResults(prev => new Map(prev).set(key, 'running'));

    // No real network tests available in web prototype
    setTimeout(() => {
      setTestResults(prev => new Map(prev).set(key, 'not-supported'));
    }, 1500);
  };

  if (selectedTool) {
    const toolInfo = LAB_TOOLS.find(t => t.tool === selectedTool)!;
    const key = `${selectedTool}-${testTarget || 'default'}`;
    const status = testResults.get(key) || 'not-tested';

    return (
      <div className="animate-fade-in">
        <ScreenHeader
          title={toolInfo.label}
          subtitle={toolInfo.desc}
          action={
            <button onClick={() => { setSelectedTool(null); setTestTarget(''); }} className="text-xs text-nora-accent">
              ← Back
            </button>
          }
        />

        <GlassCard className="p-4 mb-4">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-nora-text-tertiary uppercase tracking-wider mb-2 block">Target</label>
              <input
                type="text"
                value={testTarget}
                onChange={e => setTestTarget(e.target.value)}
                placeholder={selectedTool === 'dns' ? 'example.com' : selectedTool === 'http' ? 'https://example.com' : 'host or address'}
                className="w-full px-4 py-3 rounded-xl glass border border-nora-border bg-transparent text-nora-text placeholder-nora-text-tertiary focus:outline-none focus:border-nora-accent/30 text-sm"
              />
            </div>

            <button
              onClick={() => runTest(selectedTool)}
              className="connect-btn w-full py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2"
            >
              {status === 'running' ? <Clock size={16} className="animate-spin" /> : <Zap size={16} />}
              {status === 'running' ? 'Testing...' : 'Run Test'}
            </button>

            {/* Result */}
            {status !== 'not-tested' && (
              <GlassCard accent={status === 'pass' ? 'accent' : status === 'fail' ? 'error' : 'warning'} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <StatusIcon status={status} />
                    <StatusLabel status={status} />
                  </div>
                </div>
                {status === 'not-supported' && (
                  <p className="text-xs text-nora-text-tertiary mt-2">
                    Network diagnostic tools require native Android implementation. Cannot execute {toolInfo.label} from web environment.
                  </p>
                )}
                {status === 'running' && (
                  <p className="text-xs text-nora-warning mt-2">Testing...</p>
                )}
              </GlassCard>
            )}
          </div>
        </GlassCard>

        {/* Previous Results */}
        <div className="mt-4">
          <span className="text-xs font-semibold text-nora-text-tertiary uppercase tracking-wider mb-2 block">
            Test History
          </span>
          {Array.from(testResults.entries())
            .filter(([k]) => k.startsWith(selectedTool))
            .map(([key, s]) => (
              <GlassCard key={key} className="p-3 mb-2">
                <div className="flex items-center gap-2">
                  <StatusIcon status={s} />
                  <span className="text-xs text-nora-text truncate flex-1">{key.split('-').slice(1).join('-') || 'default'}</span>
                  <StatusLabel status={s} />
                </div>
              </GlassCard>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <ScreenHeader title="NORA LAB" subtitle="Network diagnostic tools" />

      <GlassCard accent="warning" className="p-4 mb-4">
        <p className="text-xs text-yellow-400/80">
          Network tools require native Android implementation for real connectivity testing. Results shown here indicate capability status only.
        </p>
      </GlassCard>

      <div className="space-y-3">
        {LAB_TOOLS.map(tool => (
          <GlassCard key={tool.tool} hover className="p-4" onClick={() => setSelectedTool(tool.tool)}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl glass-purple flex items-center justify-center text-nora-purple">
                {tool.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-nora-text">{tool.label}</p>
                <p className="text-xs text-nora-text-tertiary mt-0.5">{tool.desc}</p>
              </div>
              <Chip color="warning">Not tested</Chip>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
