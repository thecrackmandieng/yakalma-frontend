import { APP_BASE_HREF } from '@angular/common';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import bootstrap from './src/main.server';
import { renderApplication } from '@angular/platform-server';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(browserDistFolder, 'index.html');

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });

  // Serve static files from /browser
  server.use(express.static(browserDistFolder, {
    maxAge: '1y',
    index: 'index.html',
  }));

  // Read and validate the index.html file
  let documentTemplate: string;
  try {
    documentTemplate = readFileSync(indexHtml, 'utf8');
  } catch (err) {
    console.error('Failed to read index.html:', err);
    throw new Error('Cannot read index.html file');
  }

  // All regular routes use the Angular engine
  server.get('**', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    // Skip API routes and static files
    if (req.path.startsWith('/api') || req.path.includes('.')) {
      return next();
    }

    // Ensure we have a valid document
    if (!documentTemplate.includes('<app-root>')) {
      console.error('Document template missing <app-root> element');
      return res.status(500).send('Server configuration error');
    }

    renderApplication(bootstrap, {
      document: documentTemplate,
      url: `${protocol}://${headers.host}${originalUrl}`,
      platformProviders: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
    })
      .then((html: string) => res.send(html))
      .catch((err: Error) => {
        console.error('Error rendering application:', err);
        console.error('Stack trace:', err.stack);
        res.status(500).send(`
          <html>
            <head><title>Server Error</title></head>
            <body>
              <h1>Server Error</h1>
              <p>Failed to render the application.</p>
              <pre>${err.message}</pre>
            </body>
          </html>
        `);
      });
  });

  return server;
}

function run(): void {
  const port = parseInt(process.env['PORT'] || '4000', 10);
  const host = process.env['HOST'] || '0.0.0.0';

  // Start up the Node server
  const server = app();
  server.listen(port, host, () => {
    console.log(`Node Express server listening on http://${host}:${port}`);
  });
}

run();
