/**
 * Google connection for signed waivers: saves each PDF to a Drive folder and emails it through the
 * connected account's Gmail. One-time setup by the owner at /api/google/connect?key=ADMIN_KEY.
 * Scopes: drive.file (only files this app creates) + gmail.send (send only, cannot read mail).
 * The refresh token is kept in the private R2 bucket, never in the code.
 */

export interface GoogleEnv {
  WAIVERS?: R2Bucket;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  ADMIN_KEY?: string;
}

type GoogleConfig = { refreshToken: string; email: string; folderId: string; connectedAt: string; years?: Record<string, string> };

const CONFIG_KEY = "config/google.json";
const SCOPES = "openid email https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/gmail.send";
const FOLDER_NAME = "O'Town Signed Waivers";
const RETENTION_DAYS = 1095; // 3 years

const page = (title: string, body: string, status = 200) =>
  new Response(`<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><body style="font:16px/1.5 system-ui,sans-serif;max-width:560px;margin:60px auto;padding:0 20px"><h1 style="font-size:22px">${title}</h1>${body}</body>`, { status, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });

const redirectUri = (req: Request) => `${new URL(req.url).origin}/api/google/callback`;

export async function getConfig(env: GoogleEnv): Promise<GoogleConfig | null> {
  if (!env.WAIVERS) return null;
  const o = await env.WAIVERS.get(CONFIG_KEY);
  if (!o) return null;
  const cfg = (await o.json()) as GoogleConfig;
  // the bucket deletes objects after 3 years; re-save the connection yearly so it never expires
  if (Date.now() - o.uploaded.getTime() > 300 * 86_400_000) await env.WAIVERS.put(CONFIG_KEY, JSON.stringify(cfg));
  return cfg;
}

let cached: { token: string; exp: number } | null = null;
async function accessToken(env: GoogleEnv, cfg: GoogleConfig): Promise<string> {
  if (cached && cached.exp > Date.now() + 60_000) return cached.token;
  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: env.GOOGLE_CLIENT_ID!, client_secret: env.GOOGLE_CLIENT_SECRET!, refresh_token: cfg.refreshToken, grant_type: "refresh_token" }),
  });
  const j = (await r.json()) as { access_token?: string; expires_in?: number; error?: string };
  if (!j.access_token) throw new Error(`google token: ${j.error ?? r.status}`);
  cached = { token: j.access_token, exp: Date.now() + (j.expires_in ?? 3600) * 1000 };
  return j.access_token;
}

/** /api/google/connect and /api/google/callback */
export async function handleGoogle(req: Request, env: GoogleEnv): Promise<Response> {
  const url = new URL(req.url);
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET || !env.ADMIN_KEY || !env.WAIVERS)
    return page("Not set up yet", "<p>Add GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET and ADMIN_KEY as Worker secrets first.</p>", 503);

  if (url.pathname === "/api/google/connect") {
    if (url.searchParams.get("key") !== env.ADMIN_KEY) return page("Not allowed", "<p>This setup link needs the admin key.</p>", 403);
    const state = crypto.randomUUID();
    await env.WAIVERS.put(`state/${state}`, String(Date.now()));
    const auth = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    auth.search = new URLSearchParams({ client_id: env.GOOGLE_CLIENT_ID, redirect_uri: redirectUri(req), response_type: "code", scope: SCOPES, access_type: "offline", prompt: "consent", state }).toString();
    return Response.redirect(auth.toString(), 302);
  }

  if (url.pathname === "/api/google/callback") {
    const state = url.searchParams.get("state") || "";
    const saved = await env.WAIVERS.get(`state/${state}`);
    if (!saved || Date.now() - Number(await saved.text()) > 15 * 60_000) return page("Link expired", "<p>Please start the setup link again.</p>", 400);
    await env.WAIVERS.delete(`state/${state}`);
    if (url.searchParams.get("error")) return page("Not connected", `<p>Google said: ${url.searchParams.get("error")}</p>`, 400);
    const r = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ code: url.searchParams.get("code") || "", client_id: env.GOOGLE_CLIENT_ID, client_secret: env.GOOGLE_CLIENT_SECRET, redirect_uri: redirectUri(req), grant_type: "authorization_code" }),
    });
    const tok = (await r.json()) as { access_token?: string; refresh_token?: string; id_token?: string; scope?: string };
    if (!tok.refresh_token || !tok.access_token) return page("Not connected", "<p>Google didn't return a long-term token. Remove the app from your Google account's third-party access and try again.</p>", 400);
    if (!tok.scope?.includes("drive.file") || !tok.scope?.includes("gmail.send"))
      return page("Not connected", "<p>Please tick both boxes (Drive and Gmail) on Google's permission screen, then start again.</p>", 400);
    const email = tok.id_token ? JSON.parse(atob(tok.id_token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))).email : "";
    const f = await fetch("https://www.googleapis.com/drive/v3/files?fields=id", {
      method: "POST",
      headers: { Authorization: `Bearer ${tok.access_token}`, "content-type": "application/json" },
      body: JSON.stringify({ name: FOLDER_NAME, mimeType: "application/vnd.google-apps.folder" }),
    });
    const folder = (await f.json()) as { id?: string };
    if (!folder.id) return page("Not connected", "<p>Couldn't create the Drive folder. Make sure the Google Drive API is enabled.</p>", 500);
    const cfg: GoogleConfig = { refreshToken: tok.refresh_token, email, folderId: folder.id, connectedAt: new Date().toISOString() };
    await env.WAIVERS.put(CONFIG_KEY, JSON.stringify(cfg));
    cached = null;
    return page("Connected ✓", `<p>Signed waivers will now be emailed from and to <b>${email}</b> and saved in the Google Drive folder <b>${FOLDER_NAME}</b>.</p><p>You can close this page.</p>`);
  }
  return page("Not found", "", 404);
}

const b64url = (s: string) => btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const utf8b64 = (s: string) => btoa(String.fromCharCode(...new TextEncoder().encode(s)));
const wrap76 = (s: string) => s.replace(/.{1,76}/g, "$&\r\n");

/** Send an email with the PDF attached through the connected Gmail account. */
export async function gmailSend(env: GoogleEnv, cfg: GoogleConfig, o: { to: string; replyTo?: string; subject: string; html: string; filename: string; pdfB64: string; from?: string }) {
  const boundary = `b_${crypto.randomUUID()}`;
  const mime = [
    // WAIVER_FROM may name an alias of the connected account (e.g. info@); Gmail accepts it once "Send mail as" is set up
    `From: ${o.from || `O'Town Watersports <${cfg.email}>`}`,
    `To: ${o.to}`,
    ...(o.replyTo ? [`Reply-To: ${o.replyTo}`] : []),
    `Subject: =?UTF-8?B?${utf8b64(o.subject)}?=`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    "Content-Type: text/html; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "",
    wrap76(utf8b64(o.html)),
    `--${boundary}`,
    `Content-Type: application/pdf; name="${o.filename}"`,
    `Content-Disposition: attachment; filename="${o.filename}"`,
    "Content-Transfer-Encoding: base64",
    "",
    wrap76(o.pdfB64),
    `--${boundary}--`,
  ].join("\r\n");
  const r = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
    method: "POST",
    headers: { Authorization: `Bearer ${await accessToken(env, cfg)}`, "content-type": "application/json" },
    body: JSON.stringify({ raw: b64url(mime) }),
  });
  return r.ok;
}

/** Year subfolder inside the waivers folder ("2026", "2027", ...), created on first use and remembered. */
async function yearFolder(env: GoogleEnv, cfg: GoogleConfig, token: string, year: string): Promise<string> {
  if (cfg.years?.[year]) return cfg.years[year];
  const q = `'${cfg.folderId}' in parents and name = '${year}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;
  const found = await fetch(`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=files(id)`, { headers: { Authorization: `Bearer ${token}` } });
  let id = ((await found.json()) as { files?: { id: string }[] }).files?.[0]?.id;
  if (!id) {
    const made = await fetch("https://www.googleapis.com/drive/v3/files?fields=id", {
      method: "POST", headers: { Authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify({ name: year, mimeType: "application/vnd.google-apps.folder", parents: [cfg.folderId] }),
    });
    id = ((await made.json()) as { id?: string }).id;
  }
  if (!id) return cfg.folderId;
  cfg.years = { ...(cfg.years ?? {}), [year]: id };
  await env.WAIVERS?.put(CONFIG_KEY, JSON.stringify(cfg));
  return id;
}

/** Save the PDF to the Drive folder, inside the current year's subfolder. */
export async function driveUpload(env: GoogleEnv, cfg: GoogleConfig, filename: string, pdf: ArrayBuffer, description: string) {
  const token = await accessToken(env, cfg);
  const parent = await yearFolder(env, cfg, token, filename.match(/(\d{4})-\d{2}-\d{2}/)?.[1] ?? String(new Date().getFullYear()));
  const boundary = `b_${crypto.randomUUID()}`;
  const meta = JSON.stringify({ name: filename, parents: [parent], description, mimeType: "application/pdf" });
  const body = new Blob([
    `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${meta}\r\n`,
    `--${boundary}\r\nContent-Type: application/pdf\r\n\r\n`,
    pdf,
    `\r\n--${boundary}--`,
  ]);
  const r = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "content-type": `multipart/related; boundary=${boundary}` },
    body,
  });
  return r.ok;
}

/** Monthly: delete Drive waivers older than 3 years (R2 copies expire by the bucket's lifecycle rule). */
export async function cleanupDrive(env: GoogleEnv) {
  const cfg = await getConfig(env);
  if (!cfg || !env.GOOGLE_CLIENT_ID) return;
  const cutoff = new Date(Date.now() - RETENTION_DAYS * 86_400_000).toISOString();
  const parents = [cfg.folderId, ...Object.values(cfg.years ?? {})];
  const q = `(${parents.map((p) => `'${p}' in parents`).join(" or ")}) and mimeType != 'application/vnd.google-apps.folder' and createdTime < '${cutoff}' and trashed = false`;
  const token = await accessToken(env, cfg);
  const list = await fetch(`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=files(id)&pageSize=200`, { headers: { Authorization: `Bearer ${token}` } });
  const { files = [] } = (await list.json()) as { files?: { id: string }[] };
  for (const f of files) await fetch(`https://www.googleapis.com/drive/v3/files/${f.id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
}
