# Bhagwati Machines — Enquiry Form

## Project Structure

```
project/
├── backend/                  ← Express API server
│   ├── server.js             ← Entry point
│   ├── .env                  ← Credentials (never commit)
│   ├── .env.example          ← Template — copy to .env
│   ├── .gitignore
│   ├── package.json
│   ├── routes/
│   │   └── enquiry.js        ← POST /api/enquiry handler
│   └── services/
│       ├── salesforce.js     ← SF auth, contact check, lead/account/contact insert
│       └── marketingCloud.js ← MC auth + journey event
│
└── frontend/                 ← Static HTML/CSS/JS
    ├── index.html
    ├── css/
    │   └── style.css
    └── js/
        └── script.js         ← Form logic, calls backend API
```

---

## Setup & Run

### 1. Backend

```bash
cd backend
npm install
# copy .env.example → .env and fill in credentials (already done)
npm run dev        # development (nodemon, auto-restart)
# or
npm start          # production
```

Backend runs on **http://localhost:8000**

Health check: http://localhost:8000/health

---

### 2. Frontend

Open `frontend/index.html` in a browser.

**Recommended:** Use VS Code Live Server (right-click → Open with Live Server).
It serves from `http://127.0.0.1:5500` which is already in `ALLOWED_ORIGINS` in `.env`.

> If you change the port, add it to `ALLOWED_ORIGINS` in `.env` and restart the backend.

---

## API Flow

```
POST /api/enquiry
        │
        ▼
  Step 0 — Salesforce Auth Token
        │
        ▼
  Step 1 — Contact Lookup (by Email OR Phone)
        │
        ├─ Contact EXISTS → skip to Step 5
        │
        ├─ Contact NOT found:
        │     Step 2 — Insert Account
        │     Step 3 — Insert Contact  ← contactKey set here
        │     Step 4 — Insert Lead
        │
        ▼
  Step 5 — Marketing Cloud Auth Token
        │
        ▼
  Step 6 — MC Journey Builder Event
           ContactKey = SF Contact Id (from Step 1 or 3)
```

### Fallback behaviour

| Failure point | Response | UI message |
|---|---|---|
| SF Auth fails | 502 | "Salesforce auth failed" — retry enabled |
| Contact lookup fails | 502 | "Contact lookup failed" — retry enabled |
| Account/Contact/Lead insert fails | 502 | Specific step error — retry enabled |
| MC Auth fails | 207 | "SF records saved ✓ — MC auth failed" |
| MC Event fails | 207 | "SF records saved ✓ — Journey entry failed" |
| Network unreachable | client error | "Cannot reach server" — retry enabled |

---

## Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Server port (default 8000) |
| `ALLOWED_ORIGINS` | Comma-separated frontend URLs for CORS |
| `SF_BASE_URL` | Salesforce instance URL |
| `SF_CLIENT_ID` | Salesforce Consumer Key |
| `SF_CLIENT_SECRET` | Salesforce Consumer Secret |
| `MC_SUBDOMAIN` | MC subdomain |
| `MC_CLIENT_ID` | MC client ID |
| `MC_CLIENT_SECRET` | MC client secret |
| `MC_MID` | MC account MID |
| `MC_EVENT_DEF_KEY` | Journey Builder event definition key |