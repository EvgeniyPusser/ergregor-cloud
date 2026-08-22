import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { extname, join, normalize } from "node:path";

const host = "127.0.0.1";
const port = Number(process.env.PORT || 4173);
const root = process.cwd();

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8"
};

function resolvePath(urlPath) {
  const cleanPath = decodeURIComponent((urlPath || "/").split("?")[0]);
  const target = cleanPath === "/" ? "/index.html" : cleanPath;
  const normalized = normalize(target).replace(/^(\.\.[\\/])+/, "");
  return join(root, normalized);
}

const server = createServer(async (req, res) => {
  try {
    let filePath = resolvePath(req.url || "/");

    if (!existsSync(filePath)) {
      filePath = join(root, "index.html");
    }

    const file = await readFile(filePath);
    const ext = extname(filePath).toLowerCase();

    res.writeHead(200, {
      "Content-Type": mimeTypes[ext] || "application/octet-stream",
      "Cache-Control": "no-cache"
    });
    res.end(file);
  } catch (error) {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end(`Server error: ${error instanceof Error ? error.message : "unknown"}`);
  }
});

server.listen(port, host, () => {
  console.log(`Egregor Cloud running at http://${host}:${port}`);
});
