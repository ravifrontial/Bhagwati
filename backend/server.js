// server.js
require('dotenv').config();

const express     = require('express');
const cors        = require('cors');
const rateLimit   = require('express-rate-limit');
const enquiryRoute = require('./routes/enquiry');

const app  = express();
const PORT = process.env.PORT || 8000;

/* ── CORS ─────────────────────────────────────────
   Allow only the origins listed in .env
   In production replace with your actual domain
───────────────────────────────────────────────── */
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    // allow requests with no origin (curl, Postman, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

/* ── BODY PARSER ─────────────────────────────── */
app.use(express.json({ limit: '10kb' }));

/* ── RATE LIMITER ────────────────────────────────
   Max 10 enquiry submissions per IP per 15 minutes
───────────────────────────────────────────────── */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max     : 10,
  message : { success: false, error: 'Too many requests. Please try again later.' }
});
app.use('/api/enquiry', limiter);

/* ── ROUTES ──────────────────────────────────── */
app.use('/api/enquiry', enquiryRoute);

/* ── HEALTH CHECK ────────────────────────────── */
app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

/* ── 404 ─────────────────────────────────────── */
app.use((_req, res) => res.status(404).json({ success: false, error: 'Route not found' }));

/* ── GLOBAL ERROR HANDLER ────────────────────── */
app.use((err, _req, res, _next) => {
  console.error('[server error]', err.message);
  res.status(500).json({ success: false, error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`✅  Bhagwati backend running on http://localhost:${PORT}`);
  console.log(`    Health: http://localhost:${PORT}/health`);
  console.log(`    Enquiry endpoint: POST http://localhost:${PORT}/api/enquiry`);
});