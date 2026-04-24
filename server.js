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

const PROJECT_ROUTES = {
  '/':        { project: 'default', label: 'cb-examples2' },
  '/python1': { project: 'python1', label: 'python1' },
  '/python2': { project: 'python2', label: 'python2' },
  '/map1':    { project: 'map1',    label: 'map1' },
};

for (const [route, info] of Object.entries(PROJECT_ROUTES)) {
  app.get(route, (_req, res) => {
    log(`ROUTE ${route} -> project "${info.label}"`);
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
}

app.listen(PORT, () => {
  log(`server started on http://localhost:${PORT}`);
});
