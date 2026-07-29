# Security Policy

## Security Commitments

At **KARA**, we prioritize the security and integrity of our multi-agent autonomous runtime environment. We follow industry best practices to prevent unauthorized access, data leakage, and code injection vulnerabilities.

## Supported Versions

The following versions of KARA currently receive active security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0.0 | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability within KARA, please notify our security team responsibly. **Do not create public GitHub issues for security vulnerabilities.**

### Security Disclosure Process:
1. **Private Reporting:** Email your findings and reproduction steps to **`security@kara-ai.io`** (or submit via private security advisory on GitHub).
2. **Acknowledgment:** We will acknowledge receipt of your vulnerability report within **24 hours**.
3. **Assessment & Patching:** Our engineering team will assess the report and provide an estimated fix timeline (typically within 3 to 7 business days).
4. **Public Disclosure:** Once a security patch is deployed, a coordinated public security disclosure and advisory will be published.

## Security Best Practices for Self-Hosting

When deploying KARA in production environments:
- **Never expose `GEMINI_API_KEY` or `JWT_SECRET_KEY`** in version control. Always use environment variables or secret managers (e.g., AWS Secrets Manager, Vercel Environment Variables).
- **Configure `CORS_ORIGINS` strictly** in `backend/app/config.py` to match only trusted frontend client domains.
- **Enable TLS/HTTPS** in production reverse proxies (Nginx, Traefik, AWS ALB).
- **Keep dependencies updated** by regularly auditing `package.json` and `requirements.txt`.
