// The demo-request handler. The rest of the site is static; this one Vercel
// function receives the /contact form and forwards it through Resend, the same
// service the product uses, so there is no second email provider to manage.
//
// Environment:
//   RESEND_API_KEY        required. Without it the endpoint answers 503 and the
//                         page tells the visitor to email hello@limena.app.
//   CONTACT_TO_ADDRESS    optional, default hello@limena.app.
//   CONTACT_FROM_ADDRESS  optional, default "limena <demo@limena.app>". The
//                         domain must be verified in Resend.
//
// Accepts JSON (the page script) and form-encoded posts (no-JS fallback). The
// no-JS path answers with a redirect back to /contact so the visitor lands on
// a visible confirmation rather than raw JSON.

declare const process: { env: Record<string, string | undefined> };

const MAX_BODY_BYTES = 20_000;
const MAX_FIELD_CHARS = 1_000;
const MAX_TIMING_CHARS = 5_000;

const REQUIRED = ['first', 'last', 'email', 'organization', 'role'] as const;
const OPTIONAL = ['url', 'timing'] as const;

type Submission = {
  fields: Record<string, string>;
  kinds: string[];
  trap: string;
};

function json(status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

function redirect(fragment: string): Response {
  return new Response(null, { status: 303, headers: { location: `/contact#${fragment}` } });
}

function fail(wantsJson: boolean, status: number, error: string): Response {
  return wantsJson ? json(status, { ok: false, error }) : redirect('send-failed');
}

function succeed(wantsJson: boolean): Response {
  return wantsJson ? json(200, { ok: true }) : redirect('sent');
}

function clip(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function parseSubmission(raw: string, wantsJson: boolean): Submission | null {
  let get: (name: string) => unknown;
  let kinds: string[];

  if (wantsJson) {
    let data: unknown;
    try {
      data = JSON.parse(raw);
    } catch {
      return null;
    }
    if (typeof data !== 'object' || data === null) return null;
    const obj = data as Record<string, unknown>;
    get = (name) => obj[name];
    kinds = Array.isArray(obj.kind) ? obj.kind.map((k) => clip(k, 100)).filter(Boolean) : [];
  } else {
    const params = new URLSearchParams(raw);
    get = (name) => params.get(name) ?? '';
    kinds = params
      .getAll('kind')
      .map((k) => clip(k, 100))
      .filter(Boolean);
  }

  const fields: Record<string, string> = {};
  for (const name of REQUIRED) fields[name] = clip(get(name), MAX_FIELD_CHARS);
  for (const name of OPTIONAL) fields[name] = clip(get(name), MAX_TIMING_CHARS);

  return { fields, kinds, trap: clip(get('phone'), MAX_FIELD_CHARS) };
}

export async function POST(request: Request): Promise<Response> {
  const contentType = request.headers.get('content-type') ?? '';
  const wantsJson = contentType.includes('application/json');

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return fail(wantsJson, 400, 'Could not read the request.');
  }
  if (raw.length > MAX_BODY_BYTES) return fail(wantsJson, 413, 'Request too large.');

  const submission = parseSubmission(raw, wantsJson);
  if (!submission) return fail(wantsJson, 400, 'Could not read the request.');

  // The hidden "phone" field is a honeypot. A filled one is a bot; answer as
  // if it worked so there is nothing to learn from the response.
  if (submission.trap) return succeed(wantsJson);

  const { fields, kinds } = submission;
  const missing = REQUIRED.filter((name) => !fields[name]);
  if (missing.length > 0) return fail(wantsJson, 400, `Missing: ${missing.join(', ')}.`);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    return fail(wantsJson, 400, 'Enter a valid email address.');
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return fail(wantsJson, 503, 'Sending is not configured.');

  const to = process.env.CONTACT_TO_ADDRESS ?? 'hello@limena.app';
  const from = process.env.CONTACT_FROM_ADDRESS ?? 'limena <demo@limena.app>';

  const text = [
    `Name:         ${fields.first} ${fields.last}`,
    `Email:        ${fields.email}`,
    `Organization: ${fields.organization}`,
    `Role:         ${fields.role}`,
    `Governing:    ${kinds.length > 0 ? kinds.join(', ') : '(not specified)'}`,
    `URL or file:  ${fields.url || '(none given)'}`,
    '',
    'Timing:',
    fields.timing || '(nothing given)',
    '',
    'Sent from the /contact form on www.limena.app.',
  ].join('\n');

  const sent = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${apiKey}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: [fields.email],
      subject: `Demo request: ${fields.first} ${fields.last}, ${fields.organization}`,
      text,
    }),
  });

  if (!sent.ok) return fail(wantsJson, 502, 'Sending failed.');
  return succeed(wantsJson);
}

export function GET(): Response {
  return json(405, { ok: false, error: 'POST only.' });
}
