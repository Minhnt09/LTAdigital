import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';
const base = process.env.LTA_BASE_URL || 'http://localhost:4200';
const browser = await chromium.launch({executablePath:process.env.CHROME_PATH || '/usr/bin/google-chrome',headless:true,args:['--no-sandbox']});
try {
 const paths=['/','/services',...['cloud-cdn','cloud-compute','cloud-storage','waf-anti-ddos','ai-solutions','ai-chatbot','vas','telecom-infrastructure','superapp','vast-data','api-gate-pro'].map(slug=>'/services/'+slug),'/why-lta','/customers-partners','/contact'];
 for(const path of paths){
  const page=await browser.newPage({viewport:{width:390,height:844}});await page.addInitScript(()=>sessionStorage.setItem('lta-intro-seen','1'));const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const response=await page.goto(base+path);assert.equal(response?.status(),200,path);await page.locator('h1').first().waitFor();
  await page.evaluate(()=>scrollTo(0,document.body.scrollHeight));await page.waitForTimeout(150);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`horizontal overflow: ${path}`);
  assert.deepEqual(errors,[],`runtime errors: ${path}`);await page.close();
 }
 const page=await browser.newPage({viewport:{width:1280,height:800}});await page.addInitScript(()=>sessionStorage.setItem('lta-intro-seen','1'));await page.goto(base+'/');
 await page.locator('.language-current').click();await page.getByRole('button',{name:'🇬🇧 English',exact:true}).click();await page.waitForFunction(()=>document.querySelector('h1')?.textContent?.includes('LTA DIGITAL SOLUTIONS'));assert.match(await page.locator('h1').first().textContent(),/LTA DIGITAL SOLUTIONS/);assert.equal(await page.locator('html').getAttribute('lang'),'en');
 await page.goto(base+'/customers-partners');await page.locator('.legacy-logo img').first().waitFor();assert.equal(await page.locator('.partner-ribbon').count(),3);assert.equal(await page.locator('.partner-set:not([aria-hidden]) img').count(),31);
 for(const src of await page.locator('.legacy-logo img').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('src')))){const response=await page.request.get(base+src);assert.equal(response.status(),200,src)}
 await page.goto(base+'/services');await page.locator('.catalog-section').first().waitFor();assert.equal(await page.locator('.catalog-section').count(),5);assert.equal(await page.locator('.catalog-card').count(),11);
 await page.goto(base+'/');await page.locator('.capability-card').nth(1).scrollIntoViewIfNeeded();await page.waitForTimeout(900);await page.locator('.capability-card').nth(1).click();await page.waitForURL(/services#cloud-platform/);await page.waitForFunction(()=>Math.abs(document.getElementById('cloud-platform')?.getBoundingClientRect().top||9999)<220);
 await page.goto(base+'/services/cloud-cdn');await page.getByRole('button',{name:'Content is not cached'}).click();assert.match(await page.locator('.flow-result').innerText(),/origin/);
 await page.goto(base+'/contact');await page.getByRole('button',{name:/Check details/}).click();assert.equal(await page.getByRole('alert').count(),1);
 const narrow=await browser.newPage({viewport:{width:320,height:700}});await narrow.addInitScript(()=>{localStorage.setItem('lta-lang','en');sessionStorage.setItem('lta-intro-seen','1')});for(const path of ['/','/services','/customers-partners']){await narrow.goto(base+path);await narrow.locator('h1').first().waitFor();assert.equal(await narrow.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`EN overflow: ${path}`)}await narrow.close();
 const intro=await browser.newPage();await intro.goto(base+'/');await intro.getByRole('button',{name:/Bỏ qua/}).click();assert.equal(await intro.locator('.preloader').count(),0);await intro.close();
 const reduced=await browser.newPage({reducedMotion:'reduce'});await reduced.goto(base+'/');assert.equal(await reduced.locator('h1').first().isVisible(),true);await reduced.close();await page.close();
 console.log(`Smoke checks passed: ${paths.length} routes, mobile overflow at 390/320px, VI/EN, 31 partner logos, 5 service groups, CDN flow, contact validation, reduced motion.`);
} finally {await browser.close()}
