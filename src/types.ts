// ============================================================
// NORA TUNNEL — Types, Constants & Capability Registry
// ============================================================

// Connection States
export type ConnectionState =
  | 'IDLE'
  | 'VALIDATING'
  | 'PREPARING'
  | 'CONNECTING'
  | 'CONNECTED'
  | 'RECONNECTING'
  | 'DISCONNECTING'
  | 'DISCONNECTED'
  | 'ERROR';

export const CONNECTION_STATE_LABELS: Record<ConnectionState, string> = {
  IDLE: 'Idle',
  VALIDATING: 'Validating',
  PREPARING: 'Preparing',
  CONNECTING: 'Connecting',
  CONNECTED: 'Connected',
  RECONNECTING: 'Reconnecting',
  DISCONNECTING: 'Disconnecting',
  DISCONNECTED: 'Disconnected',
  ERROR: 'Error',
};

export const CONNECTION_STATE_COLORS: Record<ConnectionState, string> = {
  IDLE: '#6b7280',
  VALIDATING: '#f59e0b',
  PREPARING: '#f59e0b',
  CONNECTING: '#f59e0b',
  CONNECTED: '#00d4aa',
  RECONNECTING: '#f97316',
  DISCONNECTING: '#f97316',
  DISCONNECTED: '#6b7280',
  ERROR: '#ef4444',
};

// Protocols
export type Protocol =
  | 'wireguard' | 'openvpn' | 'ikev2'
  | 'vless' | 'vmess' | 'trojan' | 'shadowsocks'
  | 'hysteria' | 'hysteria2' | 'tuic' | 'naiveproxy' | 'shadowtls' | 'anytls' | 'snell'
  | 'ssh' | 'ssh-socks' | 'ssh-ws' | 'ssh-tls'
  | 'socks4' | 'socks5' | 'http' | 'https';

// Cores
export type Core = 'wireguard' | 'openvpn' | 'strongswan' | 'xray' | 'singbox' | 'ssh' | 'proxy';

// Transports
export type Transport = 'tcp' | 'udp' | 'tls' | 'websocket' | 'http2' | 'grpc' | 'quic' | 'http3';

// Security Options
export type SecurityOption = 'none' | 'tls' | 'reality' | 'auto';

// Protocol Categories
export type ProtocolCategory = 'vpn' | 'ssh' | 'xray' | 'modern' | 'proxy';

export const PROTOCOL_CATEGORIES: Record<ProtocolCategory, { label: string; protocols: Protocol[] }> = {
  vpn: {
    label: 'VPN',
    protocols: ['wireguard', 'openvpn', 'ikev2'],
  },
  ssh: {
    label: 'SSH',
    protocols: ['ssh', 'ssh-socks', 'ssh-ws', 'ssh-tls'],
  },
  xray: {
    label: 'Xray / V2Ray',
    protocols: ['vless', 'vmess', 'trojan', 'shadowsocks', 'socks5', 'http'],
  },
  modern: {
    label: 'Modern',
    protocols: ['hysteria', 'hysteria2', 'tuic', 'naiveproxy', 'shadowtls', 'anytls', 'snell'],
  },
  proxy: {
    label: 'Proxy',
    protocols: ['http', 'https', 'socks4', 'socks5', 'shadowsocks'],
  },
};

// Capability Registry — protocol → core → transports
export type CapabilityEntry = {
  protocol: Protocol;
  core: Core;
  transports: Transport[];
  security: SecurityOption[];
  available: boolean;
  note?: string;
};

export const CAPABILITY_REGISTRY: CapabilityEntry[] = [
  // VPN
  { protocol: 'wireguard', core: 'wireguard', transports: ['udp'], security: ['none'], available: false, note: 'Requires WireGuard library integration' },
  { protocol: 'openvpn', core: 'openvpn', transports: ['tcp', 'udp'], security: ['tls'], available: false, note: 'Requires OpenVPN library integration' },
  { protocol: 'ikev2', core: 'strongswan', transports: ['udp'], security: ['tls'], available: false, note: 'Requires strongSwan integration' },

  // Xray family
  { protocol: 'vless', core: 'xray', transports: ['tcp', 'websocket', 'grpc', 'http2', 'quic'], security: ['none', 'tls', 'reality'], available: false, note: 'Requires Xray core integration' },
  { protocol: 'vmess', core: 'xray', transports: ['tcp', 'websocket', 'grpc', 'http2'], security: ['none', 'tls'], available: false, note: 'Requires Xray core integration' },
  { protocol: 'trojan', core: 'xray', transports: ['tcp', 'websocket', 'grpc'], security: ['tls'], available: false, note: 'Requires Xray core integration' },
  { protocol: 'shadowsocks', core: 'xray', transports: ['tcp', 'udp'], security: ['none', 'tls'], available: false, note: 'Requires Xray core integration' },

  // Xray via sing-box
  { protocol: 'vless', core: 'singbox', transports: ['tcp', 'websocket', 'grpc', 'http2', 'quic'], security: ['none', 'tls', 'reality'], available: false, note: 'Requires sing-box core integration' },
  { protocol: 'vmess', core: 'singbox', transports: ['tcp', 'websocket', 'grpc', 'http2'], security: ['none', 'tls'], available: false, note: 'Requires sing-box core integration' },
  { protocol: 'trojan', core: 'singbox', transports: ['tcp', 'websocket'], security: ['tls'], available: false, note: 'Requires sing-box core integration' },

  // Modern
  { protocol: 'hysteria2', core: 'singbox', transports: ['udp', 'quic'], security: ['tls'], available: false, note: 'Requires sing-box core integration' },
  { protocol: 'tuic', core: 'singbox', transports: ['udp', 'quic'], security: ['tls'], available: false, note: 'Requires sing-box core integration' },
  { protocol: 'naiveproxy', core: 'singbox', transports: ['http2'], security: ['tls'], available: false, note: 'Requires sing-box core integration' },
  { protocol: 'shadowtls', core: 'singbox', transports: ['tcp'], security: ['tls'], available: false, note: 'Requires sing-box core integration' },

  // SSH
  { protocol: 'ssh', core: 'ssh', transports: ['tcp'], security: ['tls'], available: false, note: 'Requires SSH library integration' },
  { protocol: 'ssh-socks', core: 'ssh', transports: ['tcp'], security: ['tls'], available: false, note: 'Requires SSH library integration' },
  { protocol: 'ssh-ws', core: 'ssh', transports: ['websocket'], security: ['tls'], available: false, note: 'Requires SSH library integration' },
  { protocol: 'ssh-tls', core: 'ssh', transports: ['tls'], security: ['tls'], available: false, note: 'Requires SSH library integration' },

  // Proxy
  { protocol: 'socks4', core: 'proxy', transports: ['tcp'], security: ['none'], available: false, note: 'Requires proxy core integration' },
  { protocol: 'socks5', core: 'proxy', transports: ['tcp', 'udp'], security: ['none', 'tls'], available: false, note: 'Requires proxy core integration' },
  { protocol: 'http', core: 'proxy', transports: ['tcp'], security: ['none'], available: false, note: 'Requires proxy core integration' },
  { protocol: 'https', core: 'proxy', transports: ['tcp'], security: ['tls'], available: false, note: 'Requires proxy core integration' },
];

// Helper functions
export function getAvailableCores(protocol: Protocol): Core[] {
  return CAPABILITY_REGISTRY
    .filter(e => e.protocol === protocol)
    .map(e => e.core);
}

export function getAvailableTransports(protocol: Protocol, core: Core): Transport[] {
  const entry = CAPABILITY_REGISTRY.find(e => e.protocol === protocol && e.core === core);
  return entry?.transports ?? [];
}

export function getAvailableSecurity(protocol: Protocol, core: Core): SecurityOption[] {
  const entry = CAPABILITY_REGISTRY.find(e => e.protocol === protocol && e.core === core);
  return entry?.security ?? [];
}

// Profile
export interface TunnelProfile {
  id: string;
  name: string;
  protocol: Protocol;
  core: Core;
  transport: Transport;
  security: SecurityOption;
  serverAddress: string;
  port: number;
  username: string;
  favorite: boolean;
  enabled: boolean;
  createdAt: number;
  updatedAt: number;
}

// Routing
export type RoutingMode = 'global' | 'direct' | 'proxy' | 'block' | 'rule-based';
export type RuleType = 'domain' | 'ip' | 'app' | 'dns' | 'geo';
export type RuleAction = 'proxy' | 'direct' | 'block';

export interface RoutingRule {
  id: string;
  type: RuleType;
  pattern: string;
  action: RuleAction;
  enabled: boolean;
  priority: number;
}

// Connection Session
export interface ConnectionSession {
  id: string;
  profileId: string;
  profileName: string;
  protocol: Protocol;
  core: Core;
  startTime: number;
  endTime?: number;
  duration?: number;
  downloadBytes: number;
  uploadBytes: number;
  result: 'success' | 'failed' | 'active';
  disconnectReason?: string;
}

// Log Entry
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export type LogCategory = 'connection' | 'core' | 'dns' | 'routing' | 'system' | 'error';

export interface LogEntry {
  id: string;
  timestamp: number;
  level: LogLevel;
  category: LogCategory;
  message: string;
  raw?: string;
}

// Diagnostic Test
export type TestStatus = 'pass' | 'fail' | 'not-supported' | 'not-tested' | 'running';

export interface DiagnosticTest {
  id: string;
  name: string;
  status: TestStatus;
  detail?: string;
  latency?: number;
}

// Lab Tool
export type LabTool = 'ping' | 'dns' | 'tcp' | 'udp' | 'tls' | 'http' | 'route' | 'config';

export interface LabTestResult {
  tool: LabTool;
  target: string;
  status: TestStatus;
  detail?: string;
  latency?: number;
  timestamp: number;
}

// Navigation
export type Screen =
  | 'home'
  | 'profiles'
  | 'routing'
  | 'lab'
  | 'statistics'
  | 'logs'
  | 'security'
  | 'settings';

// Display helpers
export const PROTOCOL_LABELS: Record<Protocol, string> = {
  wireguard: 'WireGuard',
  openvpn: 'OpenVPN',
  ikev2: 'IKEv2/IPsec',
  vless: 'VLESS',
  vmess: 'VMess',
  trojan: 'Trojan',
  shadowsocks: 'Shadowsocks',
  hysteria: 'Hysteria',
  hysteria2: 'Hysteria2',
  tuic: 'TUIC',
  naiveproxy: 'NaiveProxy',
  shadowtls: 'ShadowTLS',
  anytls: 'AnyTLS',
  snell: 'Snell',
  ssh: 'SSH',
  'ssh-socks': 'SSH + SOCKS',
  'ssh-ws': 'SSH + WebSocket',
  'ssh-tls': 'SSH + TLS',
  socks4: 'SOCKS4',
  socks5: 'SOCKS5',
  http: 'HTTP',
  https: 'HTTPS',
};

export const CORE_LABELS: Record<Core, string> = {
  wireguard: 'WireGuard',
  openvpn: 'OpenVPN',
  strongswan: 'StrongSwan',
  xray: 'Xray',
  singbox: 'sing-box',
  ssh: 'SSH',
  proxy: 'Proxy',
};

export const TRANSPORT_LABELS: Record<Transport, string> = {
  tcp: 'TCP',
  udp: 'UDP',
  tls: 'TLS',
  websocket: 'WebSocket',
  http2: 'HTTP/2',
  grpc: 'gRPC',
  quic: 'QUIC',
  http3: 'HTTP/3',
};

export const SECURITY_LABELS: Record<SecurityOption, string> = {
  none: 'None',
  tls: 'TLS',
  reality: 'Reality',
  auto: 'Auto',
};
