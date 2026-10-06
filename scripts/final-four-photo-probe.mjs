import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const cases = [
  {
    key: 'compulsive-jimi-octave-fuzz',
    builder: 'Compulsive Audio',
    pedal: 'Jimi - Octave Fuzz',
    pages: [
      'https://www.effectsdatabase.com/type/octave/fuzz/1up'
    ]
  },
  {
    key: 'bjfe-sun-burst-fuzz',
    builder: 'BJFE / BJF Electronics',
    pedal: 'Sun Burst Fuzz',
    pages: [
      'https://bjornjuhl.com/forum/viewtopic.php?f=6&t=2261',
      'https://bjornjuhl.com/forum/viewtopic.php?f=6&t=1555.html'
    ]
  },
  {
    key: 'captain-fx-war-pig',
    builder: 'Captain FX',
    pedal: 'War Pig',
    pages: [
      'https://www.talkbass.com/threads/war-pig-a-great-looking-sounding-copy-of-90s-sovtek-big-muff.774007/'
    ]
  },
  {
    key: 'bad-penny-lollygagger',
    builder: 'Bad Penny FX',
    pedal: 'Lollygagger Overdrive',
    pages: [
      'https://www.guitarpedalx.com/news/best-of-british-pedal-builders-roundup---an-a-z-overview-in-105-parts',
      'https://www.boostguitarpedals.co.uk/collections/bad-penny-fx',
      'https://gearhero.com/collections/bad-penny-fx',
      'https://www.instagram.com/bad_penny_fx/'
    ]
  }
];

const root = path.resolve('final-four-probe');
await fs.rm(root, { recursive: true, force: true });
await fs.mkdir(root, { recursive: true });

function clean(s='') {
  return String(s).replace(/\\s+/g, ' ').trim();
}
function abs(base, value) {
  try { return new URL(value, base).href; } catch { return null; }
}
function candidatesFromSrcset(value, base) {
  return String(value || '').split(',').map(part => part.trim().split(/\\s+/)[0]).map(v => abs(base, v)).filter(Boolean);
}
function looksLikeImageUrl(url) {
  return /\\.(?:jpe?g|png|webp|gif|avif)(?:[?#].*)?$/i.test(url || '') ||
         /(?:image|img|media|photo|picture|upload|cdn)/i.test(url || '');
}
async function collect(page, pageUrl) {
  return await page.evaluate(() => {
    const out = [];
    const push = (url, kind, meta='') => {
      if (!url) return;
      out.push({url, kind, meta});
    };
    for (const el of document.images) {
      push(el.currentSrc, 'img.currentSrc', el.alt || '');
      push(el.getAttribute('src'), 'img.src', el.alt || '');
      push(el.getAttribute('data-src'), 'img.data-src', el.alt || '');
      push(el.getAttribute('data-lazy-src'), 'img.data-lazy-src', el.alt || '');
      push(el.getAttribute('data-original'), 'img.data-original', el.alt || '');
      push(el.getAttribute('srcset'), 'img.srcset', el.alt || '');
      push(el.getAttribute('data-srcset'), 'img.data-srcset', el.alt || '');
    }
    for (const el of document.querySelectorAll('source[srcset], link[rel="preload"][as="image"]')) {
      push(el.getAttribute('srcset') || el.getAttribute('href'), el.tagName.toLowerCase(), '');
    }
    for (const el of document.querySelectorAll('meta[property="og:image"],meta[name="twitter:image"]')) {
      push(el.getAttribute('content'), 'meta', '');
    }
    for (const el of document.querySelectorAll('script[type="application/ld+json"]')) {
      try {
        const data = JSON.parse(el.textContent || '');
        const visit = value => {
          if (!value) return;
          if (typeof value === 'string') push(value, 'jsonld', '');
          else if (Array.isArray(value)) value.forEach(visit);
          else if (typeof value === 'object') {
            if (value.image) visit(value.image);
            if (value.contentUrl) visit(value.contentUrl);
            if (value.url && /image/i.test(String(value['@type'] || ''))) visit(value.url);
          }
        };
        visit(data);
      } catch {}
    }
    return out;
  });
}

const browser = await chromium.launch({headless:true});
const context = await browser.newContext({
  userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/140.0.0.0 Safari/537.36',
  locale: 'en-US'
});

const summary = [];
for (const item of cases) {
  const itemDir = path.join(root, item.key);
  await fs.mkdir(itemDir, { recursive: true });
  for (let i = 0; i < item.pages.length; i++) {
    const url = item.pages[i];
    const pageDir = path.join(itemDir, String(i).padStart(2,'0'));
    await fs.mkdir(pageDir, { recursive: true });
    const page = await context.newPage();
    const record = { builder:item.builder, pedal:item.pedal, url, status:'unknown', title:'', h1:'', images:[], screenshot:null };
    try {
      await page.goto(url, {waitUntil:'domcontentloaded', timeout:15000});
      await page.waitForTimeout(1800);
      record.status = 'loaded';
      record.title = clean(await page.title());
      record.h1 = clean(await page.locator('h1').first().textContent().catch(()=>'')); 
      const raw = await collect(page, url);
      const expanded = [];
      for (const row of raw) {
        for (const candidate of (String(row.url).includes(',') ? candidatesFromSrcset(row.url, url) : [abs(url,row.url)])) {
          if (!candidate) continue;
          if (!looksLikeImageUrl(candidate)) continue;
          expanded.push({...row, url:candidate});
        }
      }
      const uniq = [...new Map(expanded.map(x => [x.url, x])).values()].slice(0,60);
      let saved = 0;
      for (let j=0; j<uniq.length; j++) {
        const c = uniq[j];
        try {
          const response = await context.request.get(c.url, {timeout:8000, failOnStatusCode:false});
          const ct = response.headers()['content-type'] || '';
          const body = await response.body();
          if (!ct.startsWith('image/') || body.length < 3000) continue;
          const ext = ct.includes('png') ? 'png' : ct.includes('webp') ? 'webp' : ct.includes('gif') ? 'gif' : ct.includes('avif') ? 'avif' : 'jpg';
          const filename = path.join(pageDir, `image-${String(saved).padStart(2,'0')}.${ext}`);
          await fs.writeFile(filename, body);
          record.images.push({file:path.basename(filename),url:c.url,kind:c.kind,meta:c.meta,bytes:body.length,contentType:ct});
          saved++;
          if (saved >= 20) break;
        } catch {}
      }
      const shot = path.join(pageDir, 'page.png');
      await page.screenshot({path:shot, fullPage:true});
      record.screenshot = 'page.png';
      await fs.writeFile(path.join(pageDir,'record.json'), JSON.stringify(record,null,2));
      summary.push(record);
    } catch (err) {
      record.status='error';
      record.error=String(err);
      await fs.writeFile(path.join(pageDir,'record.json'), JSON.stringify(record,null,2));
      summary.push(record);
    } finally {
      await page.close();
    }
  }
}
await browser.close();
await fs.writeFile(path.join(root,'SUMMARY.json'), JSON.stringify(summary,null,2));
console.log(JSON.stringify(summary.map(x => ({
  builder:x.builder,pedal:x.pedal,url:x.url,status:x.status,title:x.title,h1:x.h1,imageCount:x.images.length
})), null, 2));
