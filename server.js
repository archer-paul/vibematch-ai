// server.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8080;

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Servir tous les fichiers statiques depuis le dossier dist (inclut assets, logos, avatars, etc.)
app.use(express.static(path.join(__dirname, 'dist')));

// Route de santé
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    supabase: !!process.env.VITE_SUPABASE_URL,
    port: port
  });
});

// API routes si nécessaire
app.get('/api/*', (req, res) => {
  res.json({ message: 'API not implemented', path: req.path });
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
  console.log(`🚀 Server started on port ${port}`);
  console.log(`📁 Serving from: ${path.join(__dirname, 'dist')}`);
  console.log(`🌐 Health check: http://localhost:${port}/health`);
});