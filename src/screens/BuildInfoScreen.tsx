import { Download, Smartphone, Package, Terminal, CheckCircle, GitBranch, AlertCircle } from 'lucide-react';
import { GlassCard, ScreenHeader } from '../components';

const STEPS = [
  { num: 1, title: 'Push to GitHub', desc: 'Push this repository to your GitHub account', icon: <GitBranch size={14} /> },
  { num: 2, title: 'Go to Actions', desc: 'Click the "Actions" tab in your repository', icon: <Package size={14} /> },
  { num: 3, title: 'Run Workflow', desc: 'Click "Build Nora Tunnel APK" → "Run workflow"', icon: <CheckCircle size={14} /> },
  { num: 4, title: 'Wait ~3-5 min', desc: 'GitHub builds the APK automatically', icon: <Terminal size={14} /> },
  { num: 5, title: 'Download APK', desc: 'Click completed run → scroll to "Artifacts" → download', icon: <Download size={14} /> },
  { num: 6, title: 'Install on Device', desc: 'Transfer APK to phone → enable unknown sources → install', icon: <Smartphone size={14} /> },
];

export function BuildInfoScreen() {
  return (
    <div className="animate-fade-in">
      <ScreenHeader title="Build APK" subtitle="Create Android APK via GitHub Actions" />

      {/* App Info */}
      <GlassCard accent="accent" className="p-5 mb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl glass-accent flex items-center justify-center">
            <Package size={24} className="text-nora-accent" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-nora-text">NORA TUNNEL</h2>
            <p className="text-xs text-nora-text-tertiary">com.nora.tunnel • v1.0.0</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Smartphone size={12} className="text-nora-accent" />
            <span className="text-nora-text-secondary">Android 10+ (API 29)</span>
          </div>
          <div className="flex items-center gap-2">
            <Package size={12} className="text-nora-accent" />
            <span className="text-nora-text-secondary">ARM64 / ARM</span>
          </div>
        </div>
      </GlassCard>

      {/* GitHub Actions Steps */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-3">
          <GitBranch size={16} className="text-nora-text-tertiary" />
          <span className="text-xs font-semibold text-nora-text-tertiary uppercase tracking-wider">
            GitHub Actions — Step by Step
          </span>
        </div>

        <div className="space-y-2">
          {STEPS.map(step => (
            <GlassCard key={step.num} hover className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full glass-accent flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-nora-accent">{step.num}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-nora-text">{step.title}</p>
                  <p className="text-xs text-nora-text-tertiary mt-0.5">{step.desc}</p>
                </div>
                <div className="text-nora-text-tertiary/30">{step.icon}</div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Auto Build Notice */}
      <GlassCard accent="accent" className="p-4 mb-4">
        <div className="flex items-start gap-3">
          <CheckCircle size={16} className="text-nora-accent flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-nora-accent">Auto Build</p>
            <p className="text-xs text-nora-accent/70 mt-1">
              Every push to <code className="bg-nora-accent/10 px-1 rounded">main</code> branch automatically triggers APK build + creates a GitHub Release with the APK.
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Build Process */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-3">
          <Terminal size={16} className="text-nora-text-tertiary" />
          <span className="text-xs font-semibold text-nora-text-tertiary uppercase tracking-wider">
            Build Process
          </span>
        </div>

        <GlassCard className="p-4 font-mono text-xs">
          <div className="space-y-2 text-nora-text-secondary">
            <p className="text-nora-text-tertiary"># Step 1: Install dependencies</p>
            <p className="text-nora-accent">npm ci</p>
            <p className="mt-2 text-nora-text-tertiary"># Step 2: Build web app (Vite)</p>
            <p className="text-nora-accent">npm run build</p>
            <p className="mt-2 text-nora-text-tertiary"># Step 3: Add Capacitor Android</p>
            <p className="text-nora-accent">npx cap add android</p>
            <p className="mt-2 text-nora-text-tertiary"># Step 4: Copy web → Android</p>
            <p className="text-nora-accent">npx cap copy android && npx cap sync android</p>
            <p className="mt-2 text-nora-text-tertiary"># Step 5: Patch (VPN perms, theme, SDK)</p>
            <p className="text-nora-accent">bash scripts/patch-android.sh</p>
            <p className="mt-2 text-nora-text-tertiary"># Step 6: Build APK</p>
            <p className="text-nora-accent">cd android && ./gradlew assembleDebug</p>
            <p className="mt-2 text-nora-text-tertiary"># Output:</p>
            <p className="text-green-400">android/app/build/outputs/apk/debug/app-debug.apk</p>
          </div>
        </GlassCard>
      </div>

      {/* APK Output */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-3">
          <Download size={16} className="text-nora-text-tertiary" />
          <span className="text-xs font-semibold text-nora-text-tertiary uppercase tracking-wider">
            Build Artifacts
          </span>
        </div>

        <div className="space-y-2">
          <GlassCard hover className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl glass-accent flex items-center justify-center">
                <Download size={18} className="text-nora-accent" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-nora-text">Debug APK</p>
                <p className="text-xs text-nora-text-tertiary">nora-tunnel-v1.0.0-debug.apk</p>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-nora-accent-dim text-nora-accent">Debug</span>
            </div>
          </GlassCard>

          <GlassCard hover className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl glass-purple flex items-center justify-center">
                <Download size={18} className="text-nora-purple" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-nora-text">Release APK</p>
                <p className="text-xs text-nora-text-tertiary">nora-tunnel-v1.0.0-release-unsigned.apk</p>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-white/5 text-nora-text-secondary">Release</span>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Local Build */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-3">
          <Terminal size={16} className="text-nora-text-tertiary" />
          <span className="text-xs font-semibold text-nora-text-tertiary uppercase tracking-wider">
            Local Build (Requires Android SDK)
          </span>
        </div>

        <GlassCard className="p-4 font-mono text-xs">
          <div className="space-y-2 text-nora-text-secondary">
            <p className="text-nora-accent">chmod +x build-apk.sh && ./build-apk.sh</p>
          </div>
        </GlassCard>
      </div>

      {/* Tech Stack */}
      <GlassCard className="p-4 mb-4">
        <p className="text-xs font-semibold text-nora-text-tertiary uppercase tracking-wider mb-3">Tech Stack</p>
        <div className="grid grid-cols-2 gap-2 text-xs text-nora-text-secondary">
          <span>React 19 + Vite 7</span>
          <span>Tailwind CSS 4</span>
          <span>Capacitor 6</span>
          <span>TypeScript 5</span>
          <span>Android SDK 34</span>
          <span>Gradle 8.5</span>
          <span>AGP 8.2.2</span>
          <span>Java 17</span>
        </div>
      </GlassCard>

      {/* Notice */}
      <GlassCard accent="warning" className="p-4 mb-4">
        <div className="flex items-start gap-3">
          <AlertCircle size={16} className="text-nora-warning flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-yellow-400">Important</p>
            <p className="text-xs text-yellow-400/70 mt-1 leading-relaxed">
              This builds the complete UI as an Android APK. Real VPN/tunnel functionality requires native cores (WireGuard, Xray, sing-box) which must be integrated as separate Android library modules.
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
