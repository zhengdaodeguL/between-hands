/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { iwsdkDev } from "@iwsdk/vite-plugin-dev";
import { defineConfig, type Plugin } from "vite";
import { mkdir, open, rm, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { dirname, isAbsolute, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Keep repository guidance in source without publishing it as game content.
const projectDirectory = dirname(fileURLToPath(import.meta.url));
const buildDirectory = resolve(projectDirectory, "dist");
const bundledModules = new Set<string>();

// Apply to both the application and its workers, and retain the actual shipped
// module inventory locally for the release-license audit.
function auditBundledDependencies(worker = false): Plugin {
  return {
    name: "between-hands-audit-bundled-dependencies",
    apply: "build",
    buildStart() {
      if (!worker) bundledModules.clear();
    },
    async generateBundle(_options, bundle) {
      for (const output of Object.values(bundle)) {
        if (output.type !== "chunk") continue;
        for (const id of Object.keys(output.modules)) {
          const normalized = id.replaceAll("\\", "/");
          if (normalized.includes("/node_modules/@drawcall/uikitml/")) {
            this.error("Unlicensed @drawcall/uikitml code entered the browser build.");
          }
          bundledModules.add(relative(projectDirectory, id).replaceAll("\\", "/"));
        }
      }
      if (!worker) {
        const auditDirectory = resolve(projectDirectory, ".iwsdk");
        await mkdir(auditDirectory, { recursive: true });
        await writeFile(
          resolve(auditDirectory, "build-modules.json"),
          JSON.stringify({ modules: [...bundledModules].sort() }, null, 2) + "\n",
          "utf8",
        );
      }
    },
  };
}

const omitAgentGuidance = {
  name: "between-hands-omit-agent-guidance",
  apply: "build" as const,
  async closeBundle() {
    for (const file of ["ui/AGENTS.md", "scenes/AGENTS.md"]) {
      const target = resolve(buildDirectory, file);
      const withinBuild = relative(buildDirectory, target);
      if (isAbsolute(withinBuild) || withinBuild.startsWith("..")) {
        throw new Error(
          "Refusing to remove guidance outside the project build directory",
        );
      }
      await rm(target, { force: true });
    }
  },
};

// Only the local development server accepts fixed capture routes. Never installed in preview.
const localCapture: Plugin = {
  name: "between-hands-local-capture",
  apply: "serve",
  configureServer(server) {
    server.middlewares.use(async (request, response, next) => {
      const route = request.url;
      if (
        route !== "/__between-hands-capture/demo.webm" &&
        route !== "/__between-hands-capture/screenshot.png"
      )
        return next();
      const send = (status: number, value: object) => {
        if (response.destroyed || response.headersSent) return;
        response.statusCode = status;
        response.setHeader("Content-Type", "application/json; charset=utf-8");
        response.setHeader("Cache-Control", "no-store");
        response.end(JSON.stringify(value));
      };
      const address = request.socket.remoteAddress;
      const loopback =
        address === "127.0.0.1" ||
        address === "::1" ||
        address === "::ffff:127.0.0.1";
      let allowed = loopback;
      try {
        const host = new URL(`http://${request.headers.host ?? ""}`);
        allowed &&= ["127.0.0.1", "localhost", "[::1]"].includes(host.hostname);
        if (request.headers.origin) {
          const origin = new URL(request.headers.origin);
          allowed &&=
            ["http:", "https:"].includes(origin.protocol) &&
            origin.host === host.host;
        }
        allowed &&= request.headers["sec-fetch-site"] !== "cross-site";
      } catch {
        allowed = false;
      }
      if (!allowed) {
        send(403, { error: "Local same-origin requests only." });
        return;
      }
      if (request.method !== "POST") {
        response.setHeader("Allow", "POST");
        send(405, { error: "POST required." });
        return;
      }
      const isVideo = route.endsWith("demo.webm");
      const expectedType = isVideo ? "video/webm" : "image/png";
      if (
        request.headers["content-type"]?.split(";")[0]?.trim().toLowerCase() !==
        expectedType
      ) {
        send(415, { error: `Expected ${expectedType}.` });
        return;
      }
      const limit = 100 * 1024 * 1024;
      const declared = Number(request.headers["content-length"]);
      if (Number.isFinite(declared) && declared > limit) {
        send(413, { error: "Capture exceeds 100 MB." });
        return;
      }
      const directory = resolve(projectDirectory, "deliverables");
      const filename = `${isVideo ? "demo" : "screenshot"}-${new Date().toISOString().replace(/[:.]/g, "-")}-${randomUUID().slice(0, 8)}.${isVideo ? "webm" : "png"}`;
      const target = resolve(directory, filename);
      let file: Awaited<ReturnType<typeof open>> | undefined;
      let bytes = 0;
      let success = false;
      let created = false;
      try {
        await mkdir(directory, { recursive: true });
        file = await open(target, "wx"); // Exclusive creation: never overwrite an earlier recording.
        created = true;
        for await (const chunk of request) {
          const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
          bytes += buffer.length;
          if (bytes > limit) {
            send(413, { error: "Capture exceeds 100 MB." });
            throw new Error("Capture size limit exceeded");
          }
          let offset = 0;
          while (offset < buffer.length) {
            const result = await file.write(
              buffer,
              offset,
              buffer.length - offset,
            );
            offset += result.bytesWritten;
          }
        }
        if (!bytes) {
          send(400, { error: "Capture is empty." });
          throw new Error("Empty capture");
        }
        await file.close();
        file = undefined;
        success = true;
        send(201, { filename: `deliverables/${filename}`, bytes });
      } catch {
        send(500, { error: "Could not save the local capture." });
      } finally {
        await file?.close().catch(() => {});
        if (created && !success) await rm(target, { force: true }).catch(() => {});
      }
    });
  },
};
export default defineConfig({
  plugins: [iwsdkDev({ https: false }), auditBundledDependencies(), omitAgentGuidance, localCapture],
  worker: { plugins: () => [auditBundledDependencies(true)] },
  server: { host: "0.0.0.0", port: 8081, open: false },
  build: {
    outDir: "dist",
    sourcemap: process.env.NODE_ENV !== "production",
    target: "esnext",
    rollupOptions: { input: "./index.html" },
  },
  esbuild: { target: "esnext" },
  resolve: {
    alias: {
      "@drawcall/uikitml": resolve(projectDirectory, "src/compat/uikitml-disabled.ts"),
    },
    // SDK and application components must share the same class identities.
    dedupe: [
      "three",
      "@pmndrs/uikit",
      "@pmndrs/uikit-horizon",
      "@pmndrs/uikit-lucide",
    ],
  },
  optimizeDeps: {
    exclude: ["@babylonjs/havok"],
    include: [
      "three",
      "@pmndrs/uikit",
      "@pmndrs/uikit-horizon",
      "@pmndrs/uikit-lucide",
    ],
    esbuildOptions: { target: "esnext" },
  },
  publicDir: "public",
  base: "./",
});


