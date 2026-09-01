# 🛡️ KARA Security Policy & Vulnerability Disclosure

> **KARA — Autonomous Multi-Agent AI Engine**  
> We prioritize enterprise security, zero-trust sandbox execution, and strict data privacy across all 10 autonomous agent workflows.

---

## 🔒 Security Commitments

At **KARA**, we build security into every layer of our multi-agent architecture. From agent prompt sanitization to sandboxed code execution, our goal is to ensure your business vision, proprietary codebases, and API credentials remain strictly isolated and protected.

### Core Security Principles
* 🛡️ **Zero-Trust Agent Sandbox:** Agents operate within scoped execution environments with strict resource constraints.
* 🔐 **Vault Credential Storage:** API keys (`GEMINI_API_KEY`, `DATABASE_URL`) are never logged, stored in plain text, or exposed to client-side code.
* ⚡ **Prompt Injection Defense:** Strict input sanitization and schema-validated JSON outputs prevent prompt injection attacks against LLM runtimes.
* 📜 **Automated Vulnerability Scanning:** Continuous dependency auditing for both Next.js frontend and FastAPI backend containers.

---

## 📅 Supported Versions

Security updates and vulnerability patches are actively maintained for the following releases:

| Version | Release Type | Supported Status | Security Patch Policy |
| :--- | :--- | :---: | :--- |
| **`v1.0.x`** | Current Production | `🟢 Active` | Immediate hotfix patches & active maintenance |
| **`v0.9.x`** | Pre-Release Beta | `🟡 SLA Only` | Critical security fixes provided within 14 days |
| **`< v0.9.0`** | Legacy Builds | `🔴 End of Life` | Unsupported — Upgrade to `v1.0.x` recommended |

---

## 🚨 Reporting a Security Vulnerability

If you discover a potential security flaw, vulnerability, or unexpected behavior in KARA, **please report it responsibly**.  
**Do NOT create public GitHub issues for security vulnerabilities.**

### Disclosure Channels
* ✉️ **Security Email:** Send your report directly to **`security@kara-ai.io`**
* 🔒 **GitHub Advisory:** Submit privately via [KARA Security Advisories](https://github.com/jaymore4501/KARA/security/advisories/new)

### What to Include in Your Report
To help us triage and resolve the issue quickly, please include:
1. **Summary & Impact:** Brief description of the vulnerability and potential exposure.
2. **Affected Components:** Frontend (Next.js), Backend API (FastAPI), Swarm RAG Engine, or Agent Handlers.
3. **Reproduction Steps:** Step-by-step instructions or Proof of Concept (PoC) script.
4. **Environment Details:** OS version, Docker image digest, or dependency lockfile versions.

---

## ⏱️ Response & Remediation SLAs

Our dedicated engineering team operates under strict response SLA timeframes based on vulnerability severity:

| Severity Level | Response SLA | Target Patch Window | Public Disclosure Timeline |
| :--- | :---: | :---: | :---: |
| 🔴 **Critical** *(Remote Code Execution, Credential Leak)* | `< 12 Hours` | `24 - 48 Hours` | Post-patch deployment |
| 🟠 **High** *(Bypass Auth, Data Isolation Breach)* | `< 24 Hours` | `3 - 5 Days` | Coordinated release |
| 🟡 **Medium** *(Rate Limit Bypass, Stored XSS)* | `< 48 Hours` | `7 - 10 Days` | Next scheduled release |
| 🟢 **Low** *(Informational Leak, Non-critical CORS)* | `< 72 Hours` | `14 Days` | Regular update cycle |

---

## 🤖 AI Multi-Agent Safety & Isolation Controls

KARA deploys 10 autonomous agent personas working in parallel. We enforce strict isolation boundaries:

```text
  ┌─────────────────────────────────────────────────────────────┐
  │                    User Input / Dashboard                   │
  └──────────────────────────────┬──────────────────────────────┘
                                 │  Input Sanitization & JWT Auth
                                 ▼
  ┌─────────────────────────────────────────────────────────────┐
  │                FastAPI Gateway Security Layer               │
  │     (Cors, OAuth2 Bearer, Rate Limiter, Pydantic V2)        │
  └──────────────────────────────┬──────────────────────────────┘
                                 │  Scoped Task Execution
                                 ▼
  ┌─────────────────────────────────────────────────────────────┐
  │                Isolated Agent Swarm Runtime                  │
  │      [ Nova ]    [ Forge ]    [ CodeX ]    [ Ledger ]       │
  └──────────────────────────────┬──────────────────────────────┘
                                 │  Sanitized SQL / Static AST
                                 ▼
  ┌─────────────────────────────────────────────────────────────┐
  │             Sandboxed Database & Memory Storage             │
  └─────────────────────────────────────────────────────────────┘
```

1. **Context Window Isolation:** Agent memory scopes are segmented by project `user_id`. Agents cannot inspect parallel tenant contexts.
2. **Database Query Parameterization:** All SQLAlchemy queries utilize async parameterized bindings to eliminate SQL injection vectors.
3. **Static AST Code Verification:** Code generated by **CodeX** or **Flux** is evaluated via AST syntax parsing before execution in preview sandboxes.

---

## 🛠️ Production Hardening Checklist for Self-Hosting

When self-hosting KARA in enterprise staging or production environments, enforce the following configuration standards:

- [ ] **Secret Management:** Never hardcode secrets. Inject `JWT_SECRET_KEY`, `POSTGRES_PASSWORD`, and `GEMINI_API_KEY` via environment variables.
- [ ] **Strict CORS Configuration:** Set `CORS_ORIGINS` in `backend/app/config.py` to target explicit domain origins (e.g. `["https://app.yourdomain.com"]`).
- [ ] **HTTPS / TLS Termination:** Ensure reverse proxies (Nginx, Traefik, AWS ALB) enforce TLS 1.3 encryption for all WebSockets (`wss://`) and REST routes (`https://`).
- [ ] **Database Network Isolation:** Keep PostgreSQL and Redis instances within isolated private VPC subnets with ingress restricted to the FastAPI application layer.
- [ ] **Container Security:** Run Docker containers with non-root user privileges (`USER node` / `USER app`).

---

## 🤝 Safe Harbor Policy

We consider activities conducted under this security policy to be authorized. We will not take legal action against researchers who:
* Act in good faith to avoid privacy violations, data destruction, or interruption of services.
* Provide us reasonable time to remedy identified vulnerabilities before public disclosure.
* Do not access, modify, or download user workspace data without authorization.

Thank you for helping us keep **KARA** and our global developer community secure!
