import fs from 'node:fs/promises'
import express from 'express'

import dotenv from 'dotenv'
import path from 'node:path';
import { ViteDevServer } from 'vite';
import { getPath } from './utils';
import apiRouter from './apiRouter';
import bodyParser from 'body-parser';

// Create http server
const app = express()

const NODE_ENV = process.env.NODE_ENV
const isProduction = NODE_ENV === 'production'
// Constants
const envPath = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), `.env.${NODE_ENV}`)
]
const envResult = dotenv.config({path: envPath})
if (envResult.error) {
  throw envResult.error
}
const env = envResult.parsed

const port = env?.VOTING_PORT || 5173
const base = env?.VOTING_BASE || '/'


app.use(bodyParser.json({ type: 'application/json' }))
app.use('/api', apiRouter)

async function main() {

  // Cached production assets
  let templateHtml = '';
  let ssrManifest = '';
  if (isProduction) {
    templateHtml = await fs.readFile(getPath('dist/client/index.html'), 'utf-8');
    ssrManifest = await fs.readFile(getPath('dist/client/.vite/ssr-manifest.json'), 'utf-8');
  }
  // Add Vite or respective production middlewares
  let vite: ViteDevServer
  if (!isProduction) {
    const { createServer } = await import('vite')
    vite = await createServer({
      mode: 'development',
      server: { middlewareMode: true },
      appType: 'custom',
      base
    })
    app.use(vite.middlewares)
  } else {
    const compression: any = (await import('compression'))
    const sirv = (await import('sirv')).default
    app.use(compression())
    app.use(base, sirv(getPath('/dist/client'), { extensions: [] }))
  }

  // Serve HTML
  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl.replace(base, '')

      let template
      let render
      if (!isProduction) {
        // Always read fresh template in development
        template = await fs.readFile(getPath('index.html'), 'utf-8')
        template = await vite.transformIndexHtml(url, template)
        render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render
      } else {
        template = templateHtml;
        render = (await import(getPath('dist/entry-server/entry-server.mjs'))).render
      }
      const rendered = await render(url, ssrManifest)

      const html = template
        .replace(`<!--app-head-->`, rendered.head ?? '')
        .replace(`<!--app-html-->`, rendered.html ?? '')

      res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
    } catch (e) {
      vite?.ssrFixStacktrace(e)
      console.log(e.stack)
      res.status(500).end(e.stack)
    }
  })

  // Start http server
  app.listen(port, () => {
    const colors = {  
      reset: '\x1b[0m', 
      blue: '\x1b[34m'
    };
    console.log(`Server started at ${colors.blue}http://localhost:${port}${colors.reset}`)
  })
}

main()