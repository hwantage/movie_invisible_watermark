#!/usr/bin/env node
/**
 * Frame-by-frame video recorder using virtual time control.
 *
 * Instead of real-time screencast (which drops frames), this script:
 * 1. Overrides JS timing APIs (setTimeout, rAF, performance.now, Date.now)
 * 2. Advances virtual time one frame at a time
 * 3. Takes a perfect screenshot for each frame
 * 4. Compiles all frames into an MP4 via ffmpeg
 *
 * Usage:
 *   node scripts/record.mjs [options]
 *
 * Options:
 *   --port <number>     Dev server port (default: 5000)
 *   --output <path>     Output file path (default: output.mp4)
 *   --width <number>    Video width (default: 1920)
 *   --height <number>   Video height (default: 1080)
 *   --fps <number>      Frame rate (default: 60)
 */

import puppeteer from 'puppeteer';
import { execSync, spawn } from 'child_process';
import { mkdirSync, rmSync, existsSync } from 'fs';
import path from 'path';

// ── CLI args ──────────────────────────────────────────────
const argv = process.argv.slice(2);
function getArg(name, fallback) {
  const i = argv.indexOf(name);
  return i !== -1 && argv[i + 1] ? argv[i + 1] : fallback;
}

const PORT   = getArg('--port',   '5000');
const OUTPUT = getArg('--output', 'output.mp4');
const WIDTH  = parseInt(getArg('--width',  '1920'), 10);
const HEIGHT = parseInt(getArg('--height', '1080'), 10);
const FPS    = parseInt(getArg('--fps',    '60'),   10);

const FRAME_MS = 1000 / FPS;

// Scene durations must match VideoTemplate.tsx
const TOTAL_MS = 4000 + 5500 + 5500 + 8000 + 8000 + 6000 + 6000; // 43000ms
const TOTAL_FRAMES = Math.ceil(TOTAL_MS / FRAME_MS) + FPS * 2;     // +2s buffer for exit transitions

// ── Helpers ───────────────────────────────────────────────
async function waitForServer(url, timeoutMs = 30000) {
  const t0 = Date.now();
  while (Date.now() - t0 < timeoutMs) {
    try { const r = await fetch(url); if (r.ok) return; } catch { /* not ready */ }
    await new Promise(r => setTimeout(r, 500));
  }
  throw new Error(`Server did not start within ${timeoutMs}ms`);
}

function formatTime(ms) {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

// ── Main ──────────────────────────────────────────────────
async function main() {
  const baseUrl = `http://localhost:${PORT}`;
  let devServer = null;

  // Start dev server if needed
  let serverRunning = false;
  try { const r = await fetch(baseUrl); if (r.ok) serverRunning = true; } catch {}

  if (!serverRunning) {
    console.log('Starting dev server...');
    devServer = spawn('npm', ['run', 'dev:client', '--', '--port', PORT], {
      cwd: path.resolve(import.meta.dirname, '..'),
      stdio: 'pipe',
    });
    devServer.stderr.on('data', d => {
      if (d.toString().includes('error')) console.error('[dev]', d.toString().trim());
    });
    await waitForServer(baseUrl);
    console.log('Dev server ready.');
  } else {
    console.log(`Dev server already running on port ${PORT}.`);
  }

  // Prepare temp frames directory
  const framesDir = path.resolve('.frames_tmp');
  if (existsSync(framesDir)) rmSync(framesDir, { recursive: true });
  mkdirSync(framesDir);

  // Launch browser
  console.log(`Launching browser (${WIDTH}×${HEIGHT})...`);
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      `--window-size=${WIDTH},${HEIGHT}`,
      '--disable-web-security',
      '--autoplay-policy=no-user-gesture-required',
    ],
    defaultViewport: { width: WIDTH, height: HEIGHT },
  });

  const page = await browser.newPage();

  // ── Inject virtual-time controller BEFORE page loads ──
  await page.evaluateOnNewDocument(() => {
    // Save real implementations
    const _setTimeout      = window.setTimeout.bind(window);
    const _clearTimeout    = window.clearTimeout.bind(window);
    const _setInterval     = window.setInterval.bind(window);
    const _clearInterval   = window.clearInterval.bind(window);
    const _rAF             = window.requestAnimationFrame.bind(window);
    const _cancelRAF       = window.cancelAnimationFrame.bind(window);
    const _DateNow         = Date.now;
    const _perfNow         = performance.now.bind(performance);

    let virtualMode = false;
    let virtualTime = 0;
    let nextId = 100000;

    // Queues
    const timers = new Map();   // id → { fn, triggerTime, interval?, type }
    const rafs   = [];          // { id, fn }

    // ── setTimeout / clearTimeout ──
    window.setTimeout = (fn, delay = 0, ...args) => {
      if (!virtualMode) return _setTimeout(fn, delay, ...args);
      const id = nextId++;
      timers.set(id, { fn: () => fn(...args), triggerTime: virtualTime + delay, type: 'timeout' });
      return id;
    };
    window.clearTimeout = (id) => {
      if (timers.has(id)) timers.delete(id); else _clearTimeout(id);
    };

    // ── setInterval / clearInterval ──
    window.setInterval = (fn, delay = 0, ...args) => {
      if (!virtualMode) return _setInterval(fn, delay, ...args);
      const id = nextId++;
      timers.set(id, { fn: () => fn(...args), triggerTime: virtualTime + delay, interval: delay, type: 'interval' });
      return id;
    };
    window.clearInterval = (id) => {
      if (timers.has(id)) timers.delete(id); else _clearInterval(id);
    };

    // ── requestAnimationFrame / cancelAnimationFrame ──
    window.requestAnimationFrame = (fn) => {
      if (!virtualMode) return _rAF(fn);
      const id = nextId++;
      rafs.push({ id, fn });
      return id;
    };
    window.cancelAnimationFrame = (id) => {
      const idx = rafs.findIndex(r => r.id === id);
      if (idx !== -1) rafs.splice(idx, 1); else _cancelRAF(id);
    };

    // ── Time sources ──
    const baseReal = _perfNow();
    Date.now = () => virtualMode ? Math.floor(virtualTime + baseReal) : _DateNow();
    Object.defineProperty(performance, 'now', {
      value: () => virtualMode ? virtualTime : _perfNow(),
      writable: true, configurable: true,
    });

    // ── Frame advance (called from Puppeteer) ──
    window.__advanceFrame = (deltaMs) => {
      virtualTime += deltaMs;

      // Advance CSS animations in sync with virtual time
      for (const anim of document.getAnimations()) {
        if (anim instanceof CSSAnimation) {
          if (anim.playState === 'running') anim.pause();
          anim.currentTime = (anim.currentTime || 0) + deltaMs;
        }
      }

      // Fire due timers (sorted by trigger time)
      const due = [];
      for (const [id, t] of timers) {
        if (t.triggerTime <= virtualTime) due.push([id, t]);
      }
      due.sort((a, b) => a[1].triggerTime - b[1].triggerTime);

      for (const [id, t] of due) {
        timers.delete(id);
        try { t.fn(); } catch (e) { console.error('[virtual]', e); }
        if (t.type === 'interval' && t.interval > 0) {
          timers.set(id, { ...t, triggerTime: t.triggerTime + t.interval });
        }
      }

      // Fire rAF callbacks (one batch per frame, like real browser)
      const batch = rafs.splice(0);
      for (const r of batch) {
        try { r.fn(virtualTime); } catch (e) { console.error('[virtual]', e); }
      }
    };

    // ── Wait for React to flush (uses real setTimeout) ──
    window.__waitForRender = () => new Promise(resolve => {
      _setTimeout(() => _setTimeout(resolve, 0), 0);
    });

    // ── Recording lifecycle hooks ──
    window.__recordingStarted = false;
    window.__recordingDone = false;

    window.startRecording = async () => {
      virtualTime = _perfNow() - baseReal;
      virtualMode = true;
      window.__recordingStarted = true;

      // Pause all existing CSS animations to prevent real-time progression
      for (const anim of document.getAnimations()) {
        if (anim instanceof CSSAnimation && anim.playState === 'running') {
          anim.pause();
        }
      }

      console.log('[record] Virtual time mode ON at', virtualTime.toFixed(1), 'ms');
    };

    window.stopRecording = () => {
      window.__recordingDone = true;
      console.log('[record] stopRecording called');
    };
  });

  // Navigate
  console.log('Navigating to page...');
  await page.goto(baseUrl, { waitUntil: 'networkidle0' });

  // Wait for React mount → virtual mode activation
  await page.waitForFunction(() => window.__recordingStarted === true, { timeout: 15000 });
  console.log('App mounted. Virtual time mode active.');
  console.log(`Recording ${TOTAL_FRAMES} frames at ${FPS}fps (${formatTime(TOTAL_MS)})...\n`);

  const startTime = Date.now();

  // ── Frame-by-frame capture loop ──
  for (let frame = 0; frame < TOTAL_FRAMES; frame++) {
    // Advance virtual time
    await page.evaluate((ms) => window.__advanceFrame(ms), FRAME_MS);

    // Wait for React re-render & Framer Motion updates
    await page.evaluate(() => window.__waitForRender());

    // Capture frame
    await page.screenshot({
      path: path.join(framesDir, `frame_${String(frame).padStart(5, '0')}.jpg`),
      type: 'jpeg',
      quality: 98,
    });

    // Progress log every second of video time
    if (frame % FPS === 0) {
      const videoSec = (frame * FRAME_MS / 1000).toFixed(1);
      const pct = ((frame / TOTAL_FRAMES) * 100).toFixed(1);
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
      process.stdout.write(`\r  ${pct}% | video ${videoSec}s / ${(TOTAL_MS / 1000).toFixed(1)}s | elapsed ${elapsed}s`);
    }
  }

  console.log('\n\nCapture complete. Closing browser...');
  await browser.close();

  // ── Compile with ffmpeg ──
  console.log('Compiling video with ffmpeg...');
  const ext = path.extname(OUTPUT).toLowerCase();
  const isWebm = ext === '.webm';
  const codecArgs = isWebm
    ? `-c:v libvpx-vp9 -pix_fmt yuv420p -crf 15 -b:v 0 -row-mt 1`
    : `-c:v libx264 -pix_fmt yuv420p -preset slow -crf 15 -tune animation -profile:v high -level 4.2`;
  try {
    execSync(
      `ffmpeg -y -framerate ${FPS} -i "${framesDir}/frame_%05d.jpg" ` +
      `${codecArgs} "${OUTPUT}"`,
      { stdio: 'inherit' }
    );
  } catch (err) {
    console.error('ffmpeg compilation failed:', err.message);
    console.log(`Frames are preserved in: ${framesDir}`);
    process.exit(1);
  }

  // Cleanup
  rmSync(framesDir, { recursive: true });
  console.log(`\nDone! Video saved to: ${OUTPUT}`);

  if (devServer) {
    devServer.kill();
    console.log('Dev server stopped.');
  }

  process.exit(0);
}

main().catch((err) => {
  console.error('Recording failed:', err);
  process.exit(1);
});
