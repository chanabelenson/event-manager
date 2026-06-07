export function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.status ? err.message : 'שגיאת שרת פנימית';

  if (status >= 500) console.error(`[${req.method}] ${req.path}`, err);

  res.status(status).json({ message });
}
