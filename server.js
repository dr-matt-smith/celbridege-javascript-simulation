const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

const LOGS_DIR = path.join(__dirname, 'logs');
const LOG_FILE = path.join(LOGS_DIR, 'server.log');

if (!fs.existsSync(LOGS_DIR)) {
  fs.mkdirSync(LOGS_DIR, { recursive: true });
}

function log(line) {
  const entry = `[${new Date().toISOString()}] ${line}\n`;
  fs.appendFile(LOG_FILE, entry, (err) => {
    if (err) console.error('log write failed:', err);
  });
  process.stdout.write(entry);
}

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const tag = req.path.startsWith('/data/') ? 'DATA ' : '     ';
    log(`${tag}${req.method} ${req.path} -> ${res.statusCode} (${Date.now() - start}ms)`);
  });
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  log(`server started on http://localhost:${PORT}`);
});
