const { chromium } = require('playwright');

          function rgb(value) {
            const m = value && value.match(/rgba?\(([^)]+)\)/);
            if (!m) return null;
            return m[1].split(',').slice(0,3).map(x => Number.parseFloat(x.trim()));
          }

          function luminance(values) {
            if (!values) return 0;
            return values.map(v => {
              v /= 255;
              return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
            }).reduce((a,v,i) => a + v * [0.2126,0.7152,0.0722][i], 0);
          }

          (async()=>{
            const browser = await chromium.launch({headless:true});
            const page = await browser.newPage({ viewport:{width:1440,height:1000} });
            const consoleErrors=[];
            const pageErrors=[];
            page.on('console', msg => { if (msg.type()==='error') consoleErrors.push(msg.text()); });
            page.on('pageerror', err => pageErrors.push(String(err)));

            const catalogResponse = await page.request.get('http://127.0.0.1:4173/research/PEDAL_INDEX.json');
            if (!catalogResponse.ok()) throw new Error('Could not load the pedal index for browser audit.');
            const catalog = await catalogResponse.json();
            const researchedParents = (catalog.pedals || []).filter(
              x => x.research_record && x.catalog_role !== 'variation'
            );

            // Every cataloged image must resolve before deployment. Local cached
            // images are served by the site itself; legacy external images remain
            // supported while the archive completes the cache migration.
            const picturedEntries = (catalog.pedals || []).filter(x => x.image);
            let cursor = 0;
            const imageFailures = [];
            async function checkImageUrls() {
              while (cursor < picturedEntries.length) {
                const entry = picturedEntries[cursor++];
                const imageUrl = /^https?:\/\//i.test(entry.image)
                  ? entry.image
                  : 'http://127.0.0.1:4173/' + entry.image.replace(/^\.\/+/, '');
                try {
                  const res = await page.request.get(imageUrl, {timeout:10000});
                  const contentType = (res.headers()['content-type'] || '').toLowerCase();
                  if (!res.ok() || !contentType.startsWith('image/')) {
                    imageFailures.push(entry.company + ' / ' + entry.pedal + ' -> ' + res.status() + ' ' + contentType);
                  }
                } catch (err) {
                  imageFailures.push(entry.company + ' / ' + entry.pedal + ' -> ' + err.message);
                }
              }
            }
            await Promise.all(Array.from({length:8}, () => checkImageUrls()));
            const malformedImageUrls = picturedEntries.filter(x => !/^https?:\/\//i.test(x.image) && !/^\.\/?(?:assets\/|research\/)/i.test(x.image));
            if (malformedImageUrls.length) {
              throw new Error('Malformed catalog image paths: ' + malformedImageUrls.map(x => x.company + ' / ' + x.pedal + ' -> ' + x.image).join(' | '));
            }
            const fatalImageFailures = [];
            const externalImageWarnings = [];
            for (const failure of imageFailures) {
              const statusMatch = failure.match(/-> (\d{3}) /);
              const status = statusMatch ? Number(statusMatch[1]) : null;
              if (status === 401 || status === 403 || status === 429 || (status !== null && status >= 500)) {
                externalImageWarnings.push(failure);
              } else {
                fatalImageFailures.push(failure);
              }
            }
            if (fatalImageFailures.length) {
              throw new Error('Catalog image URL failures: ' + fatalImageFailures.join(' | '));
            }
            if (externalImageWarnings.length) {
              console.warn('External image endpoint warnings (host-side blocks, rate limits, or transient server errors): ' + externalImageWarnings.join(' | '));
            }
            console.log('Completed catalog image URL audit for', picturedEntries.length, 'pictured entries; fatal URL failures are still deployment blockers.');
            // Landing page: catalog window, core controls, and link structure.
            await page.goto('http://127.0.0.1:4173/index.html', {waitUntil:'networkidle'});
            const initialCardCount = await page.locator('#grid .card').count();
            if (initialCardCount > 72) throw new Error('Catalog rendered more than the intended 72-card window.');
            if (await page.locator('.boardRail').count()) throw new Error('Obsolete pedalboard rail elements remain on the page.');
            if (await page.locator('#search').count() !== 1) throw new Error('Search control missing.');
            if (await page.locator('[data-type]').count() < 4) throw new Error('Dirt type controls missing.');
            if (await page.locator('[data-builder]').count() < 2) throw new Error('Builder controls missing.');
            const firstHref = await page.locator('#grid .card').first().getAttribute('href');
            if (!firstHref || !firstHref.includes('pedal-detail.html?builder=')) throw new Error('Catalog card does not link to pedal-detail.html.');
            // Pagination must replace the retired Load More behavior.
            if (await page.locator('#loadMoreWrap').count()) {
              throw new Error('Retired Load More controls remain on the page.');
            }
            if (initialCardCount === 72) {
              const pagination = page.locator('#paginationWrap');
              if (await pagination.count() !== 1 || await pagination.isHidden()) {
                throw new Error('Pagination controls are missing for a multi-page catalog.');
              }
              const current = await page.locator('#pagination .pageButton.active').textContent();
              if ((current || '').trim() !== '1') throw new Error('Pagination did not start on page 1.');
              const paginationButtons = page.locator('#pagination .pageButton:not([disabled])');
              if (await paginationButtons.count() < 3) throw new Error('Pagination controls are missing.');
              const pageTwo = page.locator('#pagination .pageButton').filter({hasText:'2'}).first();
              if (await pageTwo.count() !== 1) throw new Error('Page 2 control is missing.');
              await pageTwo.click();
              await page.waitForTimeout(50);
              const pageTwoCount = await page.locator('#grid .card').count();
              if (!pageTwoCount) throw new Error('Page 2 rendered no catalog cards.');
              if ((await page.locator('#pagination .pageButton.active').textContent()).trim() !== '2') {
                throw new Error('Pagination did not advance to page 2.');
              }
            }

            // Search must include variation/colorway names.
            await page.goto('http://127.0.0.1:4173/index.html', {waitUntil:'networkidle'});
            await page.locator('#search').fill('White');
            if (await page.locator('#grid .card').filter({hasText:'DRV MOD 1'}).count() === 0) {
              throw new Error('Variation/colorway search did not find DRV MOD 1 (WHITE).');
            }

            // Type filter must constrain all visible cards.
            await page.goto('http://127.0.0.1:4173/index.html', {waitUntil:'networkidle'});
            await page.locator('[data-type="Fuzz"]').click();
            const fuzzCards = await page.locator('#grid .card').count();
            if (!fuzzCards) throw new Error('Fuzz filter returned no cards.');
            for (const chipText of await page.locator('#grid .card .chips').allTextContents()) {
              if (!chipText.includes('Fuzz')) throw new Error('Dirt type filter leaked a non-Fuzz card.');
            }

            // Builder filter must constrain all visible cards.
            await page.goto('http://127.0.0.1:4173/index.html', {waitUntil:'networkidle'});
            const builderButton = page.locator('[data-builder="Artisanal Effects"]');
            if (await builderButton.count() !== 1) throw new Error('Known builder filter button missing.');
            await builderButton.click();
            const builderTexts = await page.locator('#grid .builderNameCard').allTextContents();
            if (!builderTexts.length) throw new Error('Builder filter returned no pedals.');
            if (builderTexts.some(x => x.trim() !== 'Artisanal Effects')) {
              throw new Error('Builder filter returned a pedal from another builder.');
            }

            // Combined URL facets must work together.
            await page.goto('http://127.0.0.1:4173/index.html?type=Fuzz&builder=Artisanal%20Effects&q=cheddar', {waitUntil:'networkidle'});
            const combinedTexts = await page.locator('#grid .card').allTextContents();
            if (!combinedTexts.some(x => /Cheddar Source/i.test(x))) {
              throw new Error('Combined type + builder + search filters did not return Cheddar Source.');
            }
            await page.goto('http://127.0.0.1:4173/index.html?q=cheese', {waitUntil:'networkidle'});
            const cheeseTexts = await page.locator('#grid .card').allTextContents();
            if (!cheeseTexts.some(x => /Artisanal Cheese/i.test(x))) {
              throw new Error('Search for cheese did not return the Artisanal Cheese pedal.');
            }

            // Researched detail record, photo rendering, and contrast.
            await page.goto(
              'http://127.0.0.1:4173/pedal-detail.html?builder=' +
              encodeURIComponent('Artisanal Effects') + '&pedal=' +
              encodeURIComponent('Cheddar Source'),
              {waitUntil:'domcontentloaded'}
            );
            await page.waitForFunction(() => {
              const el = document.querySelector('#research');
              return el && el.textContent.trim().length > 40 && !/loading pedal information|could not be loaded/i.test(el.textContent);
            }, null, {timeout:10000});
            const researchedResult = await page.evaluate(() => {
              const el = document.querySelector('#research');
              const record = document.querySelector('#record');
              const style = getComputedStyle(el);
              const rect = el.getBoundingClientRect();
              const img = document.querySelector('#photoBox img');
              return {
                text: el.textContent.trim(),
                color: style.color,
                background: style.backgroundColor,
                width: rect.width,
                height: rect.height,
                recordVisible: !!record && !record.hidden,
                photoLoaded: !!img && img.complete && img.naturalWidth > 0,
                photoAlt: img ? img.alt : ''
              };
            });
            if (!researchedResult.recordVisible || researchedResult.text.length <= 40) throw new Error('Researched pedal detail did not render Pedal Info.');
            if (researchedResult.width < 200 || researchedResult.height < 40) throw new Error('Pedal Info container collapsed.');
            const fg = luminance(rgb(researchedResult.color));
            const bg = luminance(rgb(researchedResult.background));
            const contrast = (Math.max(fg,bg)+0.05)/(Math.min(fg,bg)+0.05);
            if (contrast < 4.5) throw new Error('Pedal Info text/background contrast is below 4.5.');
            if (!researchedResult.photoLoaded) throw new Error('Exact Cheddar Source photo did not load.');
            if (!researchedResult.photoAlt.includes('Cheddar Source')) throw new Error('Pedal photo alt text is missing the pedal identity.');

            // No-research / no-photo fallback.
            const noResearchEntry = (catalog.pedals || []).find(
              x => x.catalog_role !== 'variation' && !x.research_record
            );
            if (!noResearchEntry) throw new Error('No unresearchd pedal remains for fallback audit.');
            await page.goto(
              'http://127.0.0.1:4173/pedal-detail.html?builder=' +
              encodeURIComponent(noResearchEntry.company) + '&pedal=' +
              encodeURIComponent(noResearchEntry.pedal),
              {waitUntil:'networkidle'}
            );
            if (!(await page.locator('#research').textContent()).includes('Pedal information has not been added yet.')) {
              throw new Error('No-research detail fallback is missing.');
            }

            const noPhotoEntry = (catalog.pedals || []).find(
              x => x.catalog_role !== 'variation' && x.research_record && !x.image
            );
            if (!noPhotoEntry) throw new Error('No researched/photo-pending pedal remains for fallback audit.');
            await page.goto(
              'http://127.0.0.1:4173/pedal-detail.html?builder=' +
              encodeURIComponent(noPhotoEntry.company) + '&pedal=' +
              encodeURIComponent(noPhotoEntry.pedal),
              {waitUntil:'networkidle'}
            );
            if (!(await page.locator('#photoBox').textContent()).includes('No Photo Archived')) {
              throw new Error('No-photo detail fallback is missing.');
            }

            // Variation deep-link must resolve to its parent and preserve the variation notice.
            await page.goto(
              'http://127.0.0.1:4173/pedal-detail.html?builder=' +
              encodeURIComponent('1981 Inventions') + '&pedal=' +
              encodeURIComponent('DRV MOD 1 (WHITE)'),
              {waitUntil:'networkidle'}
            );
            if ((await page.locator('#name').textContent()).trim() !== 'DRV MOD 1') {
              throw new Error('Variation deep-link did not resolve to its parent pedal.');
            }
            if (!(await page.locator('#variationNotice').textContent()).includes('White')) {
              throw new Error('Variation deep-link did not preserve the White colorway notice.');
            }

            // Legacy pedal.html redirect must land on the canonical detail page.
            await page.goto(
              'http://127.0.0.1:4173/pedal.html?builder=' +
              encodeURIComponent('Artisanal Effects') + '&pedal=' +
              encodeURIComponent('Cheddar Source'),
              {waitUntil:'networkidle'}
            );
            if (!page.url().includes('/pedal-detail.html')) throw new Error('Legacy pedal.html did not redirect.');

            // Mobile behavior: no horizontal page overflow.
            await page.setViewportSize({width:390,height:900});
            await page.goto('http://127.0.0.1:4173/pedal-detail.html?builder=' +
              encodeURIComponent('Artisanal Effects') + '&pedal=' +
              encodeURIComponent('Cheddar Source'), {waitUntil:'networkidle'});
            const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
            if (overflow) throw new Error('Mobile detail page has horizontal overflow.');

            // Every researched parent pedal still needs a readable detail page.
            await page.setViewportSize({width:1440,height:1000});
            console.log('Auditing', researchedParents.length, 'researched parent pedal pages.');
            for (const entry of researchedParents) {
              const url =
                'http://127.0.0.1:4173/pedal-detail.html?builder=' +
                encodeURIComponent(entry.company) +
                '&pedal=' +
                encodeURIComponent(entry.pedal);
              await page.goto(url, {waitUntil:'domcontentloaded'});
              await page.waitForFunction(() => {
                const el = document.querySelector('#research');
                return el &&
                  el.textContent.trim().length > 40 &&
                  !/loading pedal information|could not be loaded/i.test(el.textContent);
              }, null, {timeout:10000});

              const result = await page.evaluate(() => {
                const el = document.querySelector('#research');
                const record = document.querySelector('#record');
                const style = getComputedStyle(el);
                const rect = el.getBoundingClientRect();
                return {
                  text: el.textContent.trim(),
                  color: style.color,
                  background: style.backgroundColor,
                  width: rect.width,
                  height: rect.height,
                  recordVisible: !!record && !record.hidden
                };
              });

              if (!result.recordVisible) throw new Error('Pedal detail record is hidden: ' + entry.company + ' / ' + entry.pedal);
              if (result.text.length <= 40) throw new Error('Pedal Info is unexpectedly short: ' + entry.company + ' / ' + entry.pedal);
              if (result.width < 200 || result.height < 40) throw new Error('Pedal Info container collapsed: ' + entry.company + ' / ' + entry.pedal);

              const fg = luminance(rgb(result.color));
              const bg = luminance(rgb(result.background));
              const contrast = (Math.max(fg,bg)+0.05)/(Math.min(fg,bg)+0.05);
              if (contrast < 4.5) {
                throw new Error('Pedal Info text/background contrast is below threshold for ' + entry.company + ' / ' + entry.pedal + ': ' + contrast.toFixed(2));
              }
            }

            const actionableConsoleErrors = consoleErrors.filter(message => {
              if (/net::ERR_BLOCKED_BY_RESPONSE\.NotSameOrigin/i.test(message)) return false;
              const statuses = [...message.matchAll(/status of (\d{3})/gi)].map(m => Number(m[1]));
              if (statuses.length && statuses.every(status => status === 401 || status === 403 || status === 429 || status >= 500)) return false;
              return true;
            });
            if (actionableConsoleErrors.length) throw new Error('Browser console errors: ' + actionableConsoleErrors.join(' | '));
            if (pageErrors.length) throw new Error('Browser page errors: ' + pageErrors.join(' | '));

            await browser.close();
            console.log('Expanded browser audit passed: catalog controls, combined filters, pagination, detail records, photos, fallbacks, variations, legacy redirects, mobile layout, and all researched parent pages.');
          })().catch(err => {
            console.error(err);
            process.exit(1);
          });
