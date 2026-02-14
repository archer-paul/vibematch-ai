// server.js
import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import rateLimit from 'express-rate-limit';
import youtubeRouter from './server/youtube.js';
import analyzeRouter from './server/analyze.js';
import matchRouter from './server/match.js';
import adminRouter from './server/admin.js';
import campaignsRouter from './server/campaigns.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8080;

// JSON body parser
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rate limiting for API routes (50 requests per 15 min per IP)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', apiLimiter);

// Servir tous les fichiers statiques depuis le dossier dist (inclut assets, logos, avatars, etc.)
app.use(express.static(path.join(__dirname, 'dist')));

// Route de sante
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    supabase: !!process.env.VITE_SUPABASE_URL,
    youtube: !!process.env.YOUTUBE_API_KEY && process.env.YOUTUBE_API_KEY !== 'YOUR_YOUTUBE_API_KEY_HERE',
    openai: !!process.env.OPENAI_API_KEY,
    port: port
  });
});

// API routes
app.use('/api/youtube', youtubeRouter);
app.use('/api/analyze', analyzeRouter);
app.use('/api/match', matchRouter);
app.use('/api/admin', adminRouter);
app.use('/api/campaigns', campaignsRouter);

// Catch-all for unimplemented API routes (AFTER specific routes)
app.all('/api/*', (req, res) => {
  res.status(404).json({ error: 'API route not found', path: req.path });
});

// Pour toutes les autres routes, servir index.html
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('Error serving index.html:', err);
      res.status(500).send('Error loading page');
    }
  });
});

// Gestion d'erreur
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server started on port ${port}`);
  console.log(`Serving from: ${path.join(__dirname, 'dist')}`);
  console.log(`Health check: http://localhost:${port}/health`);
  console.log(`YouTube API: ${process.env.YOUTUBE_API_KEY && process.env.YOUTUBE_API_KEY !== 'YOUR_YOUTUBE_API_KEY_HERE' ? 'configured' : 'NOT configured'}`);
  console.log(`OpenAI API: ${process.env.OPENAI_API_KEY ? 'configured' : 'NOT configured'}`);
});
