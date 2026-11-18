// Renderiza modelos .glb a WebP animado con fondo transparente (corre en GitHub Actions, no en el portatil)
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright';

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'out');
const ids = (process.env.IDS || '25,7,1').split(',').map(s => s.trim()).filter(Boolean);
fs.mkdirSync(OUT, { recursive: true });

const mime = { '.html': 'text/html', '.glb': 'model/gltf-binary', '.js': 'text/javascript' };
const server = http.createServer((req, res) => {
  const p = decodeURIComponent(req.url.split('?')[0]);
  const f = p === '/' ? path.join(ROOT, 'scripts/render/index.html') : path.join(ROOT, p);
  if (!f.startsWith(ROOT) || !fs.existsSync(f)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': mime[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
}).listen(8123);

const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 512, height: 512 } });
page.on('console', m => console.log('[page]', m.text()));
page.on('pageerror', e => console.log('[pageerror]', e.message));
await page.goto('http://localhost:8123/');
await page.waitForFunction(() => window.ready === true, null, { timeout: 60000 });

const report = [];
for (const id of ids) {
  const t0 = Date.now();
  const { frames, hasClip, clips, clipName, pingpong } = await page.evaluate(i => window.renderFrames(i, 48), id);
  const dir = path.join(OUT, `f${id}`); fs.mkdirSync(dir, { recursive: true });
  frames.forEach((d, i) => fs.writeFileSync(path.join(dir, `f${String(i).padStart(3, '0')}.png`), Buffer.from(d.split(',')[1], 'base64')));
  const webp = path.join(OUT, `${id}.webp`);
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', '24', '-i', path.join(dir, 'f%03d.png'),
    '-vf', 'scale=360:-1:flags=lanczos', '-loop', '0', '-c:v', 'libwebp_anim', '-lossless', '0', '-q:v', '60', '-compression_level', '6', webp]);
  fs.copyFileSync(path.join(dir, 'f012.png'), path.join(OUT, `${id}-preview.png`));
  fs.rmSync(dir, { recursive: true });
  const kb = Math.round(fs.statSync(webp).size / 1024);
  report.push({ id, hasClip, clips, clipName, pingpong, kb, seg: ((Date.now() - t0) / 1000).toFixed(1) });
  console.log(JSON.stringify(report.at(-1)));
}
fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2));
await browser.close(); server.close();
