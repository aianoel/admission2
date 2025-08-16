// Production optimization configuration for Hostinger deployment
import type { Express } from "express";

export function optimizeForProduction(app: Express) {
  // Disable x-powered-by header for security
  app.disable('x-powered-by');
  
  // Set security headers
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });

  // Enable trust proxy for load balancers (common on shared hosting)
  app.set('trust proxy', 1);

  // Optimize JSON parsing
  app.use((req, res, next) => {
    if (req.headers['content-type'] === 'application/json') {
      req.body = req.body || {};
    }
    next();
  });

  // Cache control for static assets
  app.use((req, res, next) => {
    if (req.url.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year
    }
    next();
  });

  console.log('Production optimizations applied');
}