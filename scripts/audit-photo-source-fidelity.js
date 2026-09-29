#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { chromium } = require('playwright');

const ROOT = process.cwd();
const INDEX = path.join(ROOT, 'research', 'PEDAL_INDEX.json');
const TRACKER = path.join(ROOT, 'research', 'PRP_TRACKER.csv');
const OUTPUT = process.env.PHOTO_FIDELITY_OUTPUT || 'photo-source-fidelity-audit.csv';
const WORKERS = Math.max(1, Number(process.env.PHOTO_FIDELITY_WORKERS || 8));
const TIMEOUT = Math.max(3000, Number(process.env.PHOTO_FIDELITY_TIMEOUT_MS || 12000));
const MAX_SOURCE_BYTES = 8 * 1024 * 1024;

function parseCsvLine(line) {
  const out = [];
  let current = '';
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (quoted && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        quoted = !quoted;
      }
    } else if (ch === ',' && !quoted) {
      out.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  out.push(current);
  return out;
}

function csvEscape(value) {
  const text = String(value ?? '');
  return '"' + text.replace(/"/g, '""') + '"';
}

function key(entry) {
  return String(entry.company || entry.builder || '') + '\u0000' + String(entry.pedal || '');
}

function localPath(image) {
  const raw = String(image || '').trim();
  if (!raw || /^https?:\/\//i.test(raw)) return null;
  const normalized = raw.replace(/^\.\//, '');
  if (!normalized.startsWith('assets/pedals/')) return null;
  return path.join(ROOT, normalized);
}

function sha256(bytes) {
  return crypto.createHash('sha256').update(bytes).digest('hex');
}

async function compareImages(page, localBytes, sourceBytes) {
  return page.evaluate(async ({ localData, sourceData }) => {
    function loadImage(dataUrl) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = dataUrl;
      });
    }

    function averageHash(img) {
      const size = 16;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(img, 0, 0, size, size);
      const data = ctx.getImageData(0, 0, size, size).data;
      const values = [];
      for (let i = 0; i < data.length; i += 4) {
        values.push(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
      }
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      let bits = '';
      for (const value of values) bits += value >= mean ? '1' : '0';
      return bits;
    }

    function hamming(a, b) {
      let count = 0;
      for (let i = 0; i < Math.min(a.length, b.length); i++) {
        if (a[i] !== b[i]) count++;
      }
      return count + Math.abs(a.length - b.length);
    }

    function sampleError(a, b) {
      const size = 32;
      const ca = document.createElement('canvas');
      const cb = document.createElement('canvas');
      ca.width = cb.width = size;
      ca.height = cb.height = size;
      const ax = ca.getContext('2d', { willReadFrequently: true });
      const bx = cb.getContext('2d', { willReadFrequently: true });
      ax.drawImage(a, 0, 0, size, size);
      bx.drawImage(b, 0, 0, size, size);
      const ad = ax.getImageData(0, 0, size, size).data;
      const bd = bx.getImageData(0, 0, size, size).data;
      let total = 0;
      for (let i = 0; i < ad.length; i += 4) {
        const al = 0.299 * ad[i] + 0.587 * ad[i + 1] + 0.114 * ad[i + 2];
        const bl = 0.299 * bd[i] + 0.587 * bd[i + 1] + 0.114 * bd[i + 2];
        total += Math.abs(al - bl) / 255;
      }
      return total / (ad.length / 4);
    }

    const [local, source] = await Promise.all([
      loadImage(localData),
      loadImage(sourceData)
    ]);
    const localHash = averageHash(local);
    const sourceHash = averageHash(source);
    const hammingDistance = hamming(localHash, sourceHash);
    const error = sampleError(local, source);

    let verdict = 'MISMATCH';
    if (hammingDistance <= 6 && error <= 0.10) verdict = 'EXACT';
    else if (hammingDistance <= 12 && error <= 0.18) verdict = 'LIKELY_SAME';
    else if (hammingDistance <= 18 && error <= 0.28) verdict = 'REVIEW';

    return { verdict, hammingDistance, sampleError: Number(error.toFixed(4)) };
  }, {
    localData: 'data:image/*;base64,' + localBytes.toString('base64'),
    sourceData: 'data:image/*;base64,' + sourceBytes.toString('base64')
  });
}

async function main() {
  const catalog = JSON.parse(fs.readFileSync(INDEX, 'utf8')).pedals || [];
  const trackerLines = fs.readFileSync(TRACKER, 'utf8').split(/\r?\n/).filter(Boolean);
  const trackerRows = trackerLines.slice(1).map(parseCsvLine);
  const pictured = new Set(
    trackerRows
      .filter(row => row[4] === 'DONE')
      .map(row => (row[0] || '') + '\u0000' + (row[1] || ''))
  );

  const targets = catalog
    .filter(entry => pictured.has(key(entry)))
    .map(entry => ({
      company: entry.company || entry.builder || '',
      pedal: entry.pedal || '',
      image: entry.image || '',
      sourcePage: entry.image_source_page || '',
      sourceUrl: entry.image_source_url || ''
    }));

  const results = [];
  let cursor = 0;

  async function worker() {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    try {
      while (true) {
        const index = cursor++;
        if (index >= targets.length) return;
        const entry = targets[index];
        const out = {
          Builder: entry.company,
          Pedal: entry.pedal,
          Image: entry.image,
          SourceURL: entry.sourceUrl,
          Status: '',
          Hamming: '',
          SampleError: '',
          LocalSHA256: '',
          SourceSHA256: '',
          Note: ''
        };

        const local = localPath(entry.image);
        if (!local || !fs.existsSync(local)) {
          out.Status = 'NO_LOCAL_IMAGE';
          out.Note = 'Tracker says Picture=DONE but local canonical asset is unavailable.';
          results.push(out);
          continue;
        }
        if (!entry.sourceUrl || !/^https?:\/\//i.test(entry.sourceUrl)) {
          out.Status = 'NO_DIRECT_SOURCE';
          out.Note = 'No direct image source URL is recorded for comparison.';
          results.push(out);
          continue;
        }

        let localBytes;
        try {
          localBytes = fs.readFileSync(local);
          out.LocalSHA256 = sha256(localBytes);
        } catch (err) {
          out.Status = 'LOCAL_READ_ERROR';
          out.Note = String(err.message || err);
          results.push(out);
          continue;
        }

        try {
          const response = await page.request.get(entry.sourceUrl, { timeout: TIMEOUT });
          const type = String(response.headers()['content-type'] || '').toLowerCase();
          const sourceBytes = await response.body();
          if (!response.ok() || !type.startsWith('image/')) {
            out.Status = 'SOURCE_UNAVAILABLE';
            out.Note = 'Source URL returned HTTP ' + response.status() + ' ' + type;
            results.push(out);
            continue;
          }
          if (!sourceBytes || sourceBytes.length < 3000 || sourceBytes.length > MAX_SOURCE_BYTES) {
            out.Status = 'SOURCE_UNAVAILABLE';
            out.Note = 'Source image payload outside audit bounds.';
            results.push(out);
            continue;
          }

          out.SourceSHA256 = sha256(sourceBytes);
          const comparison = await compareImages(page, localBytes, sourceBytes);
          out.Status = comparison.verdict;
          out.Hamming = comparison.hammingDistance;
          out.SampleError = comparison.sampleError;

          if (comparison.verdict === 'MISMATCH') {
            out.Note = 'Archived local pixels differ substantially from the declared direct source image.';
          } else if (comparison.verdict === 'REVIEW') {
            out.Note = 'Source and archived image are moderately similar; manual visual review recommended.';
          } else if (comparison.verdict === 'LIKELY_SAME') {
            out.Note = 'Source and archived image are visually consistent within the audit threshold.';
          } else {
            out.Note = 'Source and archived image are strongly consistent.';
          }
          results.push(out);
        } catch (err) {
          out.Status = 'SOURCE_UNAVAILABLE';
          out.Note = String(err.message || err);
          results.push(out);
        }
      }
    } finally {
      await page.close().catch(() => {});
    }
  }

  const browser = await chromium.launch({ headless: true });
  try {
    await Promise.all(Array.from({ length: WORKERS }, () => worker()));
  } finally {
    await browser.close();
  }

  results.sort((a, b) =>
    (a.Status === 'MISMATCH' ? 0 : a.Status === 'REVIEW' ? 1 : a.Status === 'LIKELY_SAME' ? 2 : 3) -
    (b.Status === 'MISMATCH' ? 0 : b.Status === 'REVIEW' ? 1 : b.Status === 'LIKELY_SAME' ? 2 : 3)
  );

  const headers = [
    'Builder', 'Pedal', 'Image', 'SourceURL', 'Status',
    'Hamming', 'SampleError', 'LocalSHA256', 'SourceSHA256', 'Note'
  ];
  fs.writeFileSync(
    OUTPUT,
    headers.join(',') + '\n' +
    results.map(row => headers.map(field => csvEscape(row[field])).join(',')).join('\n') + '\n'
  );

  const counts = {};
  for (const row of results) counts[row.Status] = (counts[row.Status] || 0) + 1;
  console.log('Photo source fidelity audit:', JSON.stringify(counts));
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
