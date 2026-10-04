import React, { createContext, useContext, useReducer, useCallback, useEffect, useRef } from 'react';
import type {
  ConnectionState,
  TunnelProfile,
  RoutingRule,
  RoutingMode,
  ConnectionSession,
  LogEntry,
  LogCategory,
  Screen,
  Protocol,
  Core,
  Transport,
  SecurityOption,
} from './types';

// ============================================================
// State
// ============================================================

interface AppState {
  screen: Screen;
  connectionState: ConnectionState;
  activeProfile: TunnelProfile | null;
  profiles: TunnelProfile[];
  routingMode: RoutingMode;
  routingRules: RoutingRule[];
  sessions: ConnectionSession[];
  logs: LogEntry[];
  downloadSpeed: number;
  uploadSpeed: number;
  latency: number | null;
  uptime: number;
  totalDownload: number;
  totalUpload: number;
  connectedSince: number | null;
  searchQuery: string;
  selectedLogCategory: LogCategory | 'all';
  connectionError: string | null;
}

const initialState: AppState = {
  screen: 'home',
  connectionState: 'IDLE',
  activeProfile: null,
  profiles: [],
  routingMode: 'proxy',
  routingRules: [],
  sessions: [],
  logs: [],
  downloadSpeed: 0,
  uploadSpeed: 0,
  latency: null,
  uptime: 0,
  totalDownload: 0,
  totalUpload: 0,
  connectedSince: null,
  searchQuery: '',
  selectedLogCategory: 'all',
  connectionError: null,
};

// ============================================================
// Actions
// ============================================================

type Action =
  | { type: 'NAVIGATE'; screen: Screen }
  | { type: 'SET_CONNECTION_STATE'; state: ConnectionState }
  | { type: 'SET_ACTIVE_PROFILE'; profile: TunnelProfile | null }
  | { type: 'ADD_PROFILE'; profile: TunnelProfile }
  | { type: 'UPDATE_PROFILE'; profile: TunnelProfile }
  | { type: 'DELETE_PROFILE'; id: string }
  | { type: 'TOGGLE_FAVORITE'; id: string }
  | { type: 'SET_ROUTING_MODE'; mode: RoutingMode }
  | { type: 'ADD_ROUTING_RULE'; rule: RoutingRule }
  | { type: 'DELETE_ROUTING_RULE'; id: string }
  | { type: 'TOGGLE_ROUTING_RULE'; id: string }
  | { type: 'ADD_SESSION'; session: ConnectionSession }
  | { type: 'ADD_LOG'; entry: LogEntry }
  | { type: 'CLEAR_LOGS' }
  | { type: 'UPDATE_STATS'; download: number; upload: number; latency: number | null }
  | { type: 'TICK_UPTIME' }
  | { type: 'SET_SEARCH'; query: string }
  | { type: 'SET_LOG_CATEGORY'; category: LogCategory | 'all' }
  | { type: 'SET_CONNECTION_ERROR'; error: string | null }
  | { type: 'CONNECT_START'; profile: TunnelProfile }
  | { type: 'CONNECT_FAIL'; error: string }
  | { type: 'DISCONNECT' };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'NAVIGATE':
      return { ...state, screen: action.screen };
    case 'SET_CONNECTION_STATE':
      return { ...state, connectionState: action.state };
    case 'SET_ACTIVE_PROFILE':
      return { ...state, activeProfile: action.profile };
    case 'ADD_PROFILE':
      return { ...state, profiles: [...state.profiles, action.profile] };
    case 'UPDATE_PROFILE':
      return {
        ...state,
        profiles: state.profiles.map(p => p.id === action.profile.id ? action.profile : p),
      };
    case 'DELETE_PROFILE':
      return {
        ...state,
        profiles: state.profiles.filter(p => p.id !== action.id),
        activeProfile: state.activeProfile?.id === action.id ? null : state.activeProfile,
      };
    case 'TOGGLE_FAVORITE':
      return {
        ...state,
        profiles: state.profiles.map(p =>
          p.id === action.id ? { ...p, favorite: !p.favorite } : p
        ),
      };
    case 'SET_ROUTING_MODE':
      return { ...state, routingMode: action.mode };
    case 'ADD_ROUTING_RULE':
      return { ...state, routingRules: [...state.routingRules, action.rule] };
    case 'DELETE_ROUTING_RULE':
      return { ...state, routingRules: state.routingRules.filter(r => r.id !== action.id) };
    case 'TOGGLE_ROUTING_RULE':
      return {
        ...state,
        routingRules: state.routingRules.map(r =>
          r.id === action.id ? { ...r, enabled: !r.enabled } : r
        ),
      };
    case 'ADD_SESSION':
      return { ...state, sessions: [action.session, ...state.sessions] };
    case 'ADD_LOG':
      return { ...state, logs: [...state.logs, action.entry].slice(-500) };
    case 'CLEAR_LOGS':
      return { ...state, logs: [] };
    case 'UPDATE_STATS':
      return {
        ...state,
        downloadSpeed: action.download,
        uploadSpeed: action.upload,
        latency: action.latency,
      };
    case 'TICK_UPTIME':
      return { ...state, uptime: state.uptime + 1 };
    case 'SET_SEARCH':
      return { ...state, searchQuery: action.query };
    case 'SET_LOG_CATEGORY':
      return { ...state, selectedLogCategory: action.category };
    case 'SET_CONNECTION_ERROR':
      return { ...state, connectionError: action.error };
    case 'CONNECT_START':
      return {
        ...state,
        activeProfile: action.profile,
        connectionState: 'VALIDATING',
        connectionError: null,
        downloadSpeed: 0,
        uploadSpeed: 0,
        latency: null,
        uptime: 0,
        totalDownload: 0,
        totalUpload: 0,
        connectedSince: null,
      };
    case 'CONNECT_FAIL':
      return {
        ...state,
        connectionState: 'ERROR',
        connectionError: action.error,
      };
    case 'DISCONNECT':
      return {
        ...state,
        connectionState: 'DISCONNECTED',
        activeProfile: null,
        downloadSpeed: 0,
        uploadSpeed: 0,
        latency: null,
        connectedSince: null,
        connectionError: null,
      };
    default:
      return state;
  }
}

// ============================================================
// Context
// ============================================================

interface StoreContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  navigate: (screen: Screen) => void;
  connect: (profile: TunnelProfile) => void;
  disconnect: () => void;
  addProfile: (name: string, protocol: Protocol, core: Core, transport: Transport, security: SecurityOption, server: string, port: number) => void;
  deleteProfile: (id: string) => void;
  toggleFavorite: (id: string) => void;
  addLog: (level: LogEntry['level'], category: LogEntry['category'], message: string) => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}

// ============================================================
// Provider
// ============================================================

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const uptimeRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const statsRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const navigate = useCallback((screen: Screen) => {
    dispatch({ type: 'NAVIGATE', screen });
  }, []);

  const addLog = useCallback((level: LogEntry['level'], category: LogEntry['category'], message: string) => {
    dispatch({
      type: 'ADD_LOG',
      entry: {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        level,
        category,
        message,
      },
    });
  }, []);

  const connect = useCallback((profile: TunnelProfile) => {
    // Real connection flow: validate → prepare → attempt → fail (no cores in web prototype)
    addLog('info', 'connection', `Initiating connection to ${profile.name}`);
    dispatch({ type: 'CONNECT_START', profile });

    // Phase 1: Validating
    setTimeout(() => {
      dispatch({ type: 'SET_CONNECTION_STATE', state: 'VALIDATING' });
      addLog('info', 'connection', `Validating profile: ${profile.name}`);

      // Phase 2: Preparing
      setTimeout(() => {
        dispatch({ type: 'SET_CONNECTION_STATE', state: 'PREPARING' });
        addLog('info', 'connection', `Preparing ${profile.protocol} tunnel via ${profile.core} core`);

        // Phase 3: Connecting attempt
        setTimeout(() => {
          dispatch({ type: 'SET_CONNECTION_STATE', state: 'CONNECTING' });
          addLog('info', 'connection', `Attempting connection to ${profile.serverAddress}:${profile.port}`);

          // Phase 4: Fail — no actual core available in web prototype
          setTimeout(() => {
            const errorMsg = `${profile.core} core is not available in this build. Real tunnel functionality requires native Android library integration (WireGuard, Xray, sing-box, OpenVPN, etc.).`;
            dispatch({ type: 'CONNECT_FAIL', error: errorMsg });
            addLog('error', 'connection', `Connection failed: ${profile.core} core not available`);
            addLog('error', 'core', `Core adapter for ${profile.core} not initialized`);
          }, 1500);
        }, 800);
      }, 600);
    }, 400);
  }, [addLog]);

  const disconnect = useCallback(() => {
    addLog('info', 'connection', 'Disconnecting...');
    dispatch({ type: 'SET_CONNECTION_STATE', state: 'DISCONNECTING' });

    setTimeout(() => {
      dispatch({ type: 'DISCONNECT' });
      addLog('info', 'connection', 'Disconnected');

      // Clear intervals
      if (uptimeRef.current) {
        clearInterval(uptimeRef.current);
        uptimeRef.current = null;
      }
      if (statsRef.current) {
        clearInterval(statsRef.current);
        statsRef.current = null;
      }
    }, 500);
  }, [addLog]);

  const addProfile = useCallback((name: string, protocol: Protocol, core: Core, transport: Transport, security: SecurityOption, server: string, port: number) => {
    const now = Date.now();
    const profile: TunnelProfile = {
      id: crypto.randomUUID(),
      name,
      protocol,
      core,
      transport,
      security,
      serverAddress: server,
      port,
      username: '',
      favorite: false,
      enabled: true,
      createdAt: now,
      updatedAt: now,
    };
    dispatch({ type: 'ADD_PROFILE', profile });
    addLog('info', 'connection', `Profile created: ${name} (${protocol}/${core})`);
  }, [addLog]);

  const deleteProfile = useCallback((id: string) => {
    dispatch({ type: 'DELETE_PROFILE', id });
    addLog('info', 'connection', 'Profile deleted');
  }, [addLog]);

  const toggleFavorite = useCallback((id: string) => {
    dispatch({ type: 'TOGGLE_FAVORITE', id });
  }, []);

  // Start uptime timer when connected
  useEffect(() => {
    if (state.connectionState === 'CONNECTED') {
      if (!uptimeRef.current) {
        uptimeRef.current = setInterval(() => {
          dispatch({ type: 'TICK_UPTIME' });
        }, 1000);
      }
    } else {
      if (uptimeRef.current) {
        clearInterval(uptimeRef.current);
        uptimeRef.current = null;
      }
    }

    return () => {
      if (uptimeRef.current) {
        clearInterval(uptimeRef.current);
        uptimeRef.current = null;
      }
    };
  }, [state.connectionState]);

  // Add initial logs on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      addLog('info', 'system', 'Nora Tunnel initialized');
      addLog('info', 'system', 'Web prototype — no native cores available');
      addLog('debug', 'connection', 'Waiting for user action');
    }, 300);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value: StoreContextValue = {
    state,
    dispatch,
    navigate,
    connect,
    disconnect,
    addProfile,
    deleteProfile,
    toggleFavorite,
    addLog,
  };

  return React.createElement(StoreContext.Provider, { value }, children);
}
