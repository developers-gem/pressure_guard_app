export function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

export function notFound(req, res) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  console.error("[error]", err);

  if (err.name === "ValidationError") {
    return res.status(400).json({ error: "Validation failed", details: err.errors });
  }
  if (err.code === 11000) {
    return res.status(409).json({ error: "Duplicate value", details: err.keyValue });
  }
  if (err.name === "CastError") {
    return res.status(400).json({ error: `Invalid id: ${err.value}` });
  }

  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Internal server error" });
}
