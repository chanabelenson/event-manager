export function logger(req, res, next) {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const color = res.statusCode >= 500 ? '\x1b[31m'
              : res.statusCode >= 400 ? '\x1b[33m'
              : res.statusCode >= 300 ? '\x1b[36m'
              : '\x1b[32m';
    const reset = '\x1b[0m';
    const user = req.user ? `user:${req.user.id}` : 'guest';

    console.log(`${color}[${res.statusCode}]${reset} ${req.method} ${req.originalUrl} - ${duration}ms (${user})`);
  });

  next();
}
