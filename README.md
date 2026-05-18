# vigilant-tribble

This repository does **not** support building tools for fraud, impersonation, deepfakes-for-deception, phishing, stalking, or financial exploitation.

## Safe project direction

If you want a React Native + Node.js app, build an **ethical security training platform** instead:

- simulated (clearly labeled) social-engineering awareness exercises
- consent-based automation for QA/testing only
- media tooling for accessibility and education (not identity deception)
- legitimate payment integrations (e.g., Stripe) with full compliance and audit logs

## High-level safe architecture

- **Frontend:** React Native dashboard for training campaigns and learner progress
- **Backend:** Node.js + Express API with authentication, rate limits, and audit logging
- **Realtime:** Socket.io for status updates on training simulations
- **Automation:** Puppeteer restricted to owned test environments
- **Safety controls:** consent records, abuse-prevention checks, and content moderation
