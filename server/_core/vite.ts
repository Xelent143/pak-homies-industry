import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * setupVite is only called in development mode.
 * All Vite/dev dependencies are loaded dynamically so they are
 * never resolved at module-load time in the production bundle.
 */
export async function setupVite(app: Express, server: any) {
  // Dynamic imports — these will NEVER run in production
  const { createServer: createViteServer } = await import("vite");
  const { default: viteConfig } = await import("../../vite.config");
  const { nanoid } = await import("nanoid");

  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        __dirname,
        "../..",
        "client",
        "index.html"
      );

      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/entry-client.tsx"`,
        `src="/src/entry-client.tsx?v=${nanoid()}"`
      );

      const page = await vite.transformIndexHtml(url, template);

      // Load the server entry
      const { render } = await vite.ssrLoadModule("/src/entry-server.tsx");
      const { html: appHtml, helmet, dehydratedState } = await render(url, req);

      let html = page.replace(`<!--ssr-outlet-->`, appHtml ?? "");

      // Inject dehydrated state for tRPC/React Query
      if (dehydratedState) {
        const stateScript = `<script>window.__TRPC_DEHYDRATED_STATE__ = ${JSON.stringify(dehydratedState).replace(/</g, '\\u003c')};</script>`;
        html = html.replace(`</head>`, `${stateScript}</head>`);
      }

      if (helmet) {
        html = html.replace(
          `</head>`,
          `${helmet.title?.toString() || ""}${helmet.meta?.toString() || ""}${helmet.link?.toString() || ""}${helmet.script?.toString() || ""}</head>`
        );
      }

      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  // Determine client dist path — new SSR layout uses dist/client, old layout uses dist/public
  let distClientPath = path.resolve(process.cwd(), "dist", "client");
  if (!fs.existsSync(distClientPath)) {
    distClientPath = path.resolve(process.cwd(), "dist", "public");
  }

  if (!fs.existsSync(distClientPath)) {
    console.error(`[Static] Could not find any build directory at ${distClientPath}`);
    return;
  }

  console.log(`[Static] Serving client assets from: ${distClientPath}`);

  // Serve static assets (JS, CSS, images, etc.) but NOT index.html for root
  app.use(express.static(distClientPath, { index: false }));

  // Try to load the SSR render function once at startup
  let ssrRender: ((url: string, req?: any) => Promise<{ html: string; helmet?: any; dehydratedState?: unknown }>) | null = null;
  const distServerPath = path.resolve(__dirname, "server");
  const serverEntryPath = path.resolve(distServerPath, "entry-server.js");

  if (fs.existsSync(serverEntryPath)) {
    // Eagerly try to import the SSR module. If it fails, we log and continue in SPA mode.
    import(/* @vite-ignore */ `file://${serverEntryPath.replace(/\\/g, "/")}`)
      .then((mod) => {
        ssrRender = mod.render;
        console.log("[SSR] Server-side rendering enabled ✓");
      })
      .catch((err) => {
        console.warn("[SSR] Could not load SSR entry, falling back to SPA mode:", err?.message || err);
      });
  } else {
    console.warn(`[SSR] No server entry found at ${serverEntryPath}. Running in SPA-only mode.`);
  }

  // Catch-all: serve index.html with optional SSR injection
  app.use("*", async (_req, res) => {
    try {
      const url = _req.originalUrl;
      const indexHtmlPath = path.resolve(distClientPath, "index.html");
      let html = await fs.promises.readFile(indexHtmlPath, "utf-8");

      // If SSR is available, render and inject
      if (ssrRender) {
        try {
          const { html: appHtml, helmet, dehydratedState } = await ssrRender(url, _req);
          html = html.replace(`<!--ssr-outlet-->`, appHtml ?? "");

          if (dehydratedState) {
            const stateScript = `<script>window.__TRPC_DEHYDRATED_STATE__ = ${JSON.stringify(dehydratedState).replace(/</g, '\\u003c')};</script>`;
            html = html.replace(`</head>`, `${stateScript}</head>`);
          }

          if (helmet) {
            html = html.replace(
              `</head>`,
              `${helmet.title?.toString() || ""}${helmet.meta?.toString() || ""}${helmet.link?.toString() || ""}${helmet.script?.toString() || ""}</head>`
            );
          }
        } catch (ssrErr: any) {
          console.error("[SSR] Render error, serving SPA fallback:", ssrErr?.message);
          // SSR failed — just serve the plain index.html (SPA mode)
          html = html.replace(`<!--ssr-outlet-->`, "");
        }
      } else {
        // No SSR available — serve as plain SPA
        html = html.replace(`<!--ssr-outlet-->`, "");
      }

      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e: any) {
      console.error("[Static] Fatal error serving page:", e?.message);
      res.status(500).send("Internal Server Error");
    }
  });
}
