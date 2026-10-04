# 🛡️ Security Policy — NORA TUNNEL

## Security Principles

1. **No custom cryptography** — Use established protocol implementations only
2. **Validate untrusted input** — All imported configurations are parsed and validated
3. **Redact secrets** — Passwords, private keys, and tokens are never displayed in logs
4. **Secure storage** — Credentials stored in Android Keystore-backed encrypted storage
5. **Minimal permissions** — Only request permissions actually needed
6. **No data exfiltration** — Configurations and credentials stay on device
7. **No hidden telemetry** — Zero network calls without user knowledge
8. **Android security compliance** — Use official VpnService, no security bypass

## Credential Storage

| Data Type | Storage Method |
|-----------|---------------|
| Private Keys | Android Keystore (hardware-backed when available) |
| Passwords | Encrypted SharedPreferences |
| Auth Tokens | Android Keystore |
| Configuration | Encrypted local database (Room) |
| Logs | Local file, auto-rotated, secrets redacted |

## Secret Redaction

The following patterns are automatically redacted from logs:
- `password=******`
- `privateKey=******`
- `token=******`
- `secret=******`
- `auth=******`

## VPN Service Security

- Uses Android's official `android.net.VpnService`
- Proper VPN permission flow (user must confirm)
- Foreground service with notification
- Clean lifecycle management
- No background traffic interception
- No bypass of Android security restrictions

## Kill Switch

Kill switch functionality relies on Android's built-in always-on VPN feature. Nora Tunnel does **not**:
- Implement custom kill switch mechanisms that could bypass Android security
- Intercept traffic outside the VPN interface
- Modify system routing tables directly

## Reporting

To report a security vulnerability:
1. Do NOT file a public GitHub issue
2. Email: security@nora.tunnel (placeholder)
3. Include: description, reproduction steps, potential impact
4. We will respond within 72 hours

## Audit Checklist

Before any release:
- [ ] No debug secrets in build
- [ ] No test credentials in code
- [ ] No fake server/connection
- [ ] No fake statistics
- [ ] No development endpoints
- [ ] No unnecessary permissions
- [ ] No sensitive logs
- [ ] No hardcoded private keys
- [ ] No hidden telemetry
- [ ] No placeholder "connected" implementation
- [ ] ProGuard/R8 enabled for release
- [ ] Network security config enforced
- [ ] Certificate pinning where applicable
