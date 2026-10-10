const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const config = require('./src/config');
require('./src/db');
require('./src/db/bootstrap').bootstrap();
require('./src/repositories/showroom').verathDealer();
require('./src/services');
const auth = require('./src/lib/auth');

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use((req, res, next) => { // baseline security headers
  res.set({ 'X-Content-Type-Options': 'nosniff', 'X-Frame-Options': 'DENY', 'Referrer-Policy': 'strict-origin-when-cross-origin' });
  if (config.isProduction) res.set('Strict-Transport-Security', 'max-age=31536000');
  next();
});
app.get('/healthz', (req, res) => { try { require('./src/db').get('SELECT 1 AS ok'); res.json({ ok: true }); } catch { res.status(500).json({ ok: false }); } });
// Uploaded files: served from the configured upload directory (the persistent disk in production), never executable.
app.use('/uploads', express.static(config.uploadDir, { maxAge: '1h', setHeaders: (res) => res.set('Content-Security-Policy', "default-src 'none'; style-src 'unsafe-inline'") }));
app.use(express.static(path.join(config.root, 'public'), { maxAge: '1h', setHeaders: (res, p) => { if (p.includes(`${path.sep}uploads${path.sep}`)) res.set('Content-Security-Policy', "default-src 'none'; style-src 'unsafe-inline'"); } }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false, limit: '100kb' }));
app.use(express.json({ limit: '60kb' }));
app.use(require('./src/render'));
app.use(auth.sameOrigin);
app.use(auth.attachUser);

app.use('/', require('./src/modules/auth/routes'));
app.use('/dealer', require('./src/modules/dealer/routes'));
app.use('/admin/showroom', require('./src/modules/showroom/admin'));
app.use('/admin', require('./src/modules/admin/routes'));
app.use('/api/ai', require('./src/modules/ai/routes'));
app.use('/', require('./src/modules/showroom/routes'));
app.use('/', require('./src/modules/ai/pages'));
app.use('/', require('./src/modules/marketplace/routes'));

app.use((req, res) => res.status(404).render('error', { title: 'Page not found', message: 'We could not find that page.' }));
app.use((err, req, res, next) => { // eslint-disable-line
  console.error(err);
  if (res.headersSent) return next(err);
  res.status(500).render('error', { title: 'Something went wrong', message: 'An unexpected error occurred. Try again.' });
});

if (require.main === module) app.listen(config.port, () => console.log(`Verath Auto running on http://localhost:${config.port}`));
module.exports = app;
