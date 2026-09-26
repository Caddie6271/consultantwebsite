# Jason Martin Consulting Website

Tech-themed consulting site for **Jason Martin Consulting** (jascmartin.com).

## Features

- Dark, modern cybersecurity / IT consulting aesthetic
- Pages: Home, Services (vCISO, vCIO, Infrastructure, Security), Support Portal, About, Contact
- Client **Support Portal** ready for integration with your **Work** backend
- Responsive, fast, no build step required (Tailwind via CDN)

## Quick Start (local)

```bash
cd jascmartin-website
npx serve .
# or
python3 -m http.server 8080
```

## Support Portal + Work Integration

Client Login and the homepage portal buttons go to the live customer portal:

https://work.jascmartin.com/portal

The support page sign-in form posts to `https://work.jascmartin.com/portal/login`.

Work itself (the app at work.jascmartin.com) is a separate project. Restyling that app to match this site has to be done in that project's source. The visual tokens to copy are below.

## Matching Work to this design

Replace the portal page colors in the Work templates:

| Token | Value |
|-------|--------|
| Page background | `#05080f` |
| Card | `#0a0f1c` |
| Border | `#1a2332` |
| Muted text | `#9ca3af` |
| Accent button | `#00d4ff` with text `#05080f` |
| Font | Inter |

Staff login stays at `https://work.jascmartin.com/login`. Do not send clients there.


### To connect your real Work backend

1. Open `js/main.js`
2. Update the `WORK_CONFIG` object:

```js
const WORK_CONFIG = {
  apiBase: 'https://YOUR-WORK-API-URL',   // e.g. https://work.jascmartin.com/api
  useRealApi: true,                       // flip this to true

  endpoints: {
    login: '/auth/login',                 // POST { email, password } → { token, user }
    tickets: '/tickets',                  // GET → array of tickets
    createTicket: '/tickets',             // POST { subject, description, category, priority }
    ticketById: (id) => `/tickets/${id}`,
  },
};
```

3. Make sure your Work API:
   - Accepts `Authorization: Bearer <token>`
   - Has CORS enabled for `https://jascmartin.com` (and `www` if used)
   - Returns JSON in roughly this shape:

**Login response**
```json
{
  "token": "jwt-or-session-token",
  "user": { "name": "Client Name", "email": "client@company.com" }
}
```

**Ticket object**
```json
{
  "id": "REQ-ABC123",
  "subject": "Need SOC 2 gap assessment",
  "description": "...",
  "category": "vCISO",
  "priority": "high",
  "status": "open",          // open | in-progress | resolved
  "createdAt": "2026-08-22T12:00:00Z"
}
```

That’s all the frontend needs. Once `useRealApi: true` and the endpoints match, every login, ticket list, and new request goes straight to Work.

## Deploy to Cloudflare Pages

1. Log in to [dash.cloudflare.com](https://dash.cloudflare.com)
2. **Workers & Pages** → **Create** → **Pages** → **Upload assets**
3. Drag the entire contents of this folder
4. After deploy → **Custom domains** → add `jascmartin.com`

Because the domain is already on Cloudflare, DNS will be automatic.

## File Structure

```
jascmartin-website/
├── index.html
├── services.html
├── support.html          ← Client portal (Work-ready)
├── about.html
├── contact.html
├── css/styles.css
├── js/main.js            ← Work config lives here
└── README.md
```

© 2026 Jason Martin Consulting
