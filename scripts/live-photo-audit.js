const { chromium } = require('playwright');
          const fs = require('fs');
          const { execFileSync } = require('child_process');
          const catalog = JSON.parse(fs.readFileSync('research/PEDAL_INDEX.json', 'utf8'));
          const base = process.env.LIVE_SITE_URL.replace(/\/$/, '') + '/';

          function key(x) { return (x.company || '') + '\\0' + (x.pedal || ''); }
          function detailUrl(x) {
            const p = new URL('pedal-detail.html', base);
            p.searchParams.set('builder', x.company);
            p.searchParams.set('pedal', x.pedal);
            return p.href;
          }

          function imageUrl(image) {
            return /^https?:\/\//i.test(image)
              ? image
              : new URL(String(image).replace(/^\.\//, ''), base).href;
          }

          async function waitForLive(url, page) {
            let last = null;
            for (let attempt = 1; attempt <= 10; attempt++) {
              try {
                const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
                if (response && response.ok()) return;
                last = new Error('HTTP ' + (response ? response.status() : 'no response'));
              } catch (err) { last = err; }
              await new Promise(r => setTimeout(r, Math.min(6000, attempt * 2000)));
            }
            throw last || new Error('Live page did not become available');
          }

          async function waitForImageLoaded(page, selector) {
            let last = null;
            for (let attempt = 1; attempt <= 10; attempt++) {
              try {
                await page.waitForFunction((sel) => {
                  const img = document.querySelector(sel);
                  return !!img && img.complete && img.naturalWidth > 0;
                }, selector, { timeout: 5000 });
                return;
              } catch (err) {
                last = err;
                await page.reload({ waitUntil: 'domcontentloaded', timeout: 20000 }).catch(() => {});
                await new Promise(r => setTimeout(r, Math.min(5000, attempt * 1000)));
              }
            }
            throw last || new Error('image did not become ready');
          }

          (async()=>{
            const browser = await chromium.launch({headless:true});
            const pictured = (catalog.pedals || []).filter(x => x.image);

            const changedFiles = (() => {
              try {
                return execFileSync('git', ['diff-tree', '--no-commit-id', '--name-only', '-r', 'HEAD^', 'HEAD'], { encoding: 'utf8' })
                  .split(/\r?\n/).map(x => x.trim()).filter(Boolean);
              } catch {
                return [];
              }
            })();

            const canonicalToken = (v) => String(v || '').trim().toLowerCase();
            const touched = pictured.filter(entry => {
              const imageValue = String(entry.image || '');
              const image = imageValue.startsWith('./') ? imageValue.slice(2) : imageValue;
              const record = `research/pedals/${entry.company}/${entry.pedal}.md`;
              return changedFiles.includes(image) || changedFiles.includes(record);
            });

            const touchedKeys = new Set(touched.map(key));
            const smoke = pictured
              .filter(entry => !touchedKeys.has(key(entry)))
              .sort((a,b) => key(a).localeCompare(key(b)))
              .slice(0, 24);

            const auditMode = process.env.LIVE_AUDIT_MODE || 'changed';
            const auditTargets = auditMode === 'all'
              ? pictured
              : [...touched, ...smoke];

            console.log(
              'Live photo audit scope:', auditMode,
              '| changed targets:', touched.length,
              '| smoke targets:', smoke.length,
              '| total checked:', auditTargets.length,
              '| pictured catalog:', pictured.length
            );

            const failures = [];
            let cursor = 0;

            async function worker() {
              const page = await browser.newPage({viewport:{width:1440,height:1000}});
              try {
                while (cursor < auditTargets.length) {
                  const entry = auditTargets[cursor++];
                  const id = key(entry);
                  try {
                    const external = /^https?:\/\//i.test(entry.image);
                    let res = null;
                    let type = '';
                    let lastImageError = null;
                    const attempts = external ? 1 : 4;
                    for (let attempt = 1; attempt <= attempts; attempt++) {
                      try {
                        res = await page.request.get(imageUrl(entry.image), {timeout:15000});
                        type = (res.headers()['content-type'] || '').toLowerCase();
                        if (res.ok() && type.startsWith('image/')) break;
                        lastImageError = new Error('HTTP ' + res.status() + ' ' + type);
                      } catch (err) {
                        lastImageError = err;
                      }
                      if (attempt < attempts) {
                        await new Promise(r => setTimeout(r, attempt * 2500));
                      }
                    }
                    if (external && (!res || !res.ok() || !type.startsWith('image/'))) {
                      console.warn('EXTERNAL PHOTO WARNING:', id, '-> image HTTP ' + (res ? res.status() : 'no response') + ' ' + type);
                      continue;
                    }
                    if (!res || !res.ok() || !type.startsWith('image/')) {
                      throw new Error('local image unavailable after retries: ' + (lastImageError?.message || 'unknown error'));
                    }

                    if (entry.catalog_role === 'variation') {
                      if (!entry.variation_name) throw new Error('variation is missing variation_name');
                      const variationUrl = new URL(detailUrl(entry));
                      variationUrl.searchParams.set('variation', entry.variation_name);
                      await waitForLive(variationUrl.href, page);
                      await page.waitForFunction(() => document.querySelector('#record') && !document.querySelector('#record').hidden, null, {timeout:20000});
                      await waitForImageLoaded(page, '#photoBox img');
                      const variationDom = await page.evaluate((entry) => {
                        const img = document.querySelector('#photoBox img');
                        const fallback = document.querySelector('#photoBox span');
                        return {
                          loaded: !!img && img.complete && img.naturalWidth > 0,
                          fallbackVisible: !!fallback && !fallback.hidden && /No Photo Archived/.test(fallback.textContent || ''),
                          src: img ? img.src : null,
                          expected: entry.image ? new URL(entry.image, location.href).href : null
                        };
                      }, entry);
                      if (!variationDom.loaded) throw new Error('variation photo did not load');
                      if (variationDom.fallbackVisible) throw new Error('variation page shows No Photo Archived despite an image');
                      if (!variationDom.src || variationDom.src !== variationDom.expected) throw new Error('variation photo src does not match catalog image');
                    } else {
                      await waitForLive(detailUrl(entry), page);
                      await page.waitForFunction(() => document.querySelector('#record') && !document.querySelector('#record').hidden, null, {timeout:20000});
                      await waitForImageLoaded(page, '#photoBox img');
                      const dom = await page.evaluate((entry) => {
                        const img = document.querySelector('#photoBox img');
                        const fallback = document.querySelector('#photoBox span');
                        const actualSrc = img ? img.src : null;
                        const expectedSrc = entry.image ? new URL(entry.image, location.href).href : null;
                        return {
                          hasImg: !!img,
                          loaded: !!img && img.complete && img.naturalWidth > 0,
                          fallbackVisible: !!fallback && !fallback.hidden && /No Photo Archived/.test(fallback.textContent || ''),
                          src: actualSrc,
                          expected: expectedSrc
                        };
                      }, entry);
                      if (!dom.hasImg || !dom.loaded) throw new Error('detail photo did not load');
                      if (dom.fallbackVisible) throw new Error('detail page still shows No Photo Archived');
                      if (!dom.src || dom.src !== dom.expected) throw new Error('detail photo src does not match catalog image');
                    }
                  } catch (err) {
                    failures.push(id + ' -> ' + err.message);
                  }
                }
              } finally {
                await page.close().catch(() => {});
              }
            }

            await Promise.all(Array.from({length:8}, () => worker()));
            await browser.close();
            console.log('Live photo audit checked', auditTargets.length, 'catalog entries.');
            if (failures.length) {
              for (const failure of failures) console.error('LIVE PHOTO FAILURE:', failure);
              process.exit(1);
            }
            console.log('Live photo audit passed: every changed photo placement plus the smoke set resolved to an image and loaded on its canonical live detail placement.');
          })().catch(err => { console.error(err); process.exit(1); });
