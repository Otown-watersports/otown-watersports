# Apple Wallet pass — status: NOT ENABLED

The card page hides the Wallet button (`card.walletEnabled = false` in `content/card.ts`). Nothing is faked.

## What you need (Apple Developer Program, $99/yr)
1. Pass Type ID (e.g. `pass.com.otownwatersports.card`) + its signing certificate (.p12 export)
2. Apple WWDR intermediate certificate (G4)
3. Team ID
4. Certificate passphrase

## Architecture (to build once credentials exist)
- Worker route `GET /api/wallet/pass` (already routed through `run_worker_first: ["/api/*"]`).
- Builds `pass.json` (generic style, bg #101F27, turquoise #49C6D6, QR -> https://otownwatersports.com/card), icons/logo PNGs, `manifest.json` (SHA-1 per file), detached PKCS#7 `signature`, zips to `.pkpass`, serves `application/vnd.apple.pkpass`.
- Secrets ONLY in Cloudflare: `WALLET_PASS_TYPE_ID`, `WALLET_TEAM_ID`, `WALLET_CERT_P12_B64`, `WALLET_CERT_PASSPHRASE`, `WALLET_WWDR_PEM`. Never in repo/client.
- Missing config -> endpoint returns 503 and the button stays hidden.

## Readiness checklist
- [ ] Apple Developer account + Pass Type ID + cert
- [ ] Secrets added in Cloudflare
- [ ] Endpoint implemented + deployed
- [ ] Opened on a real iPhone, "Add to Apple Wallet" works
- [ ] Flip `walletEnabled` to true
