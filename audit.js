import fs from 'fs';
import path from 'path';

const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const availableHtmlFiles = new Set(htmlFiles);

console.log('--- STARTING COMPREHENSIVE PRODUCTION AUDIT ---');
let hasErrors = false;

htmlFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');
  console.log(`\nAuditing: ${file}`);

  // 1. Check for duplicate IDs
  const idRegex = /id=["']([^"']+)["']/g;
  const ids = [];
  let match;
  while ((match = idRegex.exec(content)) !== null) {
    ids.push(match[1]);
  }

  const duplicates = ids.filter((item, index) => ids.indexOf(item) !== index);
  if (duplicates.length > 0) {
    console.error(`  [ERROR] Duplicate IDs found: ${[...new Set(duplicates)].join(', ')}`);
    hasErrors = true;
  } else {
    console.log(`  [OK] No duplicate IDs. Found ${ids.length} unique IDs.`);
  }

  // 2. Check for empty/placeholder links
  const hrefRegex = /href=["']([^"']*)["']/g;
  const hrefs = [];
  while ((match = hrefRegex.exec(content)) !== null) {
    hrefs.push({ val: match[1], index: match.index });
  }

  const badHrefs = hrefs.filter(h => h.val === '#' || h.val === 'javascript:void(0)' || h.val === '');
  if (badHrefs.length > 0) {
    console.warn(`  [WARN] Placeholder hrefs ("#" or empty): ${badHrefs.length} occurrences`);
  }

  // 3. Check for broken internal links
  const brokenLinks = [];
  hrefs.forEach(h => {
    let val = h.val;
    // Skip external links, anchors, protocols
    if (val.startsWith('http://') || val.startsWith('https://') || val.startsWith('#') || val.startsWith('mailto:') || val.startsWith('tel:') || val.startsWith('javascript:')) {
      return;
    }
    
    // Strip query parameters and hash anchors
    let cleanPath = val.split('?')[0].split('#')[0];
    if (!cleanPath) return;

    // Handle leading slash
    if (cleanPath.startsWith('/')) {
      cleanPath = cleanPath.substring(1);
    }

    // Check if it exists in the filesystem
    if (!fs.existsSync(cleanPath)) {
      brokenLinks.push(val);
    }
  });

  if (brokenLinks.length > 0) {
    console.error(`  [ERROR] Broken internal links: ${[...new Set(brokenLinks)].join(', ')}`);
    hasErrors = true;
  } else {
    console.log(`  [OK] All internal links are valid.`);
  }

  // 4. Check for missing image alt attributes
  const imgRegex = /<img[^>]+>/g;
  const imgs = [];
  while ((match = imgRegex.exec(content)) !== null) {
    imgs.push(match[0]);
  }

  const missingAlt = imgs.filter(img => !img.includes('alt='));
  if (missingAlt.length > 0) {
    console.warn(`  [WARN] Missing alt attribute on ${missingAlt.length} images.`);
  } else {
    console.log(`  [OK] All images have alt attribute.`);
  }
});

console.log('\n--- AUDIT COMPLETE ---');
if (hasErrors) {
  process.exit(1);
} else {
  process.exit(0);
}
