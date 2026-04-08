#!/usr/bin/env tsx
/**
 * Comprehensive Test Suite for FormeHaus Hydrogen Storefront
 * Tests: Routes, Payment Workflow, Images, and Core Functionality
 */

import {execSync} from 'child_process';
import fs from 'fs';
import path from 'path';

// Test Results Storage
const results = {
  routes: [] as {route: string; status: 'pass' | 'fail'; error?: string}[],
  images: [] as {file: string; size: string; oversized: boolean}[],
  payment: [] as {test: string; status: 'pass' | 'fail'; details?: string}[],
  environment: [] as {variable: string; status: 'configured' | 'missing'}[],
};

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// ============================================
// 1. ROUTE VALIDATION
// ============================================
function validateRoutes() {
  log('\n═══════════════════════════════════════════', 'cyan');
  log('           ROUTE VALIDATION', 'cyan');
  log('═══════════════════════════════════════════\n', 'cyan');

  const routesDir = path.join(process.cwd(), 'app', 'routes');
  const routeFiles: string[] = [];

  function findRoutes(dir: string) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        findRoutes(fullPath);
      } else if (item.endsWith('.tsx')) {
        routeFiles.push(fullPath);
      }
    }
  }

  findRoutes(routesDir);

  const criticalRoutes = [
    '($locale)._index.tsx', // Home
    '($locale).cart.tsx', // Cart
    '($locale).products.$productHandle.tsx', // Product page
    '($locale).collections.$collectionHandle.tsx', // Collection page
    '($locale).account.tsx', // Account
    '($locale).hyperpay.initiate.tsx', // HyperPay
    '($locale).hyperpay.callback.tsx',
    '($locale).tap.initiate.tsx', // Tap Payments
    '($locale).tap.callback.tsx',
    '($locale).tap.webhook.tsx',
    '($locale).search.tsx', // Search
  ];

  log(`Total route files found: ${routeFiles.length}`, 'blue');
  log('Critical routes check:\n', 'yellow');

  for (const route of criticalRoutes) {
    const found = routeFiles.some((f) => f.includes(route));
    const status = found ? 'pass' : 'fail';
    results.routes.push({route, status: found ? 'pass' : 'fail'});
    log(`  ${found ? '✓' : '✗'} ${route}`, found ? 'green' : 'red');
  }

  // Check for common issues
  log('\nRoute structure analysis:', 'yellow');
  
  let issueCount = 0;
  for (const routeFile of routeFiles) {
    const content = fs.readFileSync(routeFile, 'utf-8');
    const hasLoader = content.includes('export async function loader');
    const hasAction = content.includes('export async function action');
    const hasDefaultExport = content.includes('export default function');
    
    // Check for potential issues
    if (!hasLoader && !hasAction && !hasDefaultExport) {
      log(`  ⚠ ${path.basename(routeFile)}: No loader/action/default export`, 'yellow');
      issueCount++;
    }
  }
  
  if (issueCount === 0) {
    log('  ✓ All routes have proper exports', 'green');
  }

  return routeFiles.length;
}

// ============================================
// 2. IMAGE SIZE AUDIT
// ============================================
function auditImages() {
  log('\n═══════════════════════════════════════════', 'cyan');
  log('           IMAGE SIZE AUDIT', 'cyan');
  log('═══════════════════════════════════════════\n', 'cyan');

  const publicDir = path.join(process.cwd(), 'public');
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const images: {file: string; size: number}[] = [];

  function findImages(dir: string) {
    if (!fs.existsSync(dir)) return;
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        findImages(fullPath);
      } else if (imageExtensions.some((ext) => item.toLowerCase().endsWith(ext))) {
        images.push({file: fullPath, size: stat.size});
      }
    }
  }

  findImages(publicDir);

  // Sort by size (largest first)
  images.sort((a, b) => b.size - a.size);

  const MAX_RECOMMENDED_SIZE = 500 * 1024; // 500KB
  const MAX_CRITICAL_SIZE = 1024 * 1024; // 1MB

  let oversizedCount = 0;
  let criticalCount = 0;

  log(`Total images: ${images.length}\n`, 'blue');
  log('Top 15 largest images:', 'yellow');

  for (let i = 0; i < Math.min(15, images.length); i++) {
    const img = images[i];
    const sizeMB = (img.size / (1024 * 1024)).toFixed(2);
    const sizeKB = (img.size / 1024).toFixed(0);
    const relativePath = path.relative(process.cwd(), img.file);
    
    let color: keyof typeof colors = 'green';
    let icon = '✓';
    
    if (img.size > MAX_CRITICAL_SIZE) {
      color = 'red';
      icon = '✗';
      criticalCount++;
      oversizedCount++;
    } else if (img.size > MAX_RECOMMENDED_SIZE) {
      color = 'yellow';
      icon = '⚠';
      oversizedCount++;
    }

    const sizeDisplay = img.size > 1024 * 1024 ? `${sizeMB}MB` : `${sizeKB}KB`;
    log(`  ${icon} ${relativePath} (${sizeDisplay})`, color);
    
    results.images.push({
      file: relativePath,
      size: sizeDisplay,
      oversized: img.size > MAX_RECOMMENDED_SIZE,
    });
  }

  log(`\nSummary:`, 'blue');
  log(`  Total images: ${images.length}`, 'reset');
  log(`  Oversized (>500KB): ${oversizedCount}`, oversizedCount > 0 ? 'yellow' : 'green');
  log(`  Critical (>1MB): ${criticalCount}`, criticalCount > 0 ? 'red' : 'green');

  if (criticalCount > 0) {
    log(`\n⚠️  CRITICAL: ${criticalCount} images exceed 1MB and should be optimized!`, 'red');
  }

  return {total: images.length, oversized: oversizedCount, critical: criticalCount};
}

// ============================================
// 3. PAYMENT WORKFLOW VALIDATION
// ============================================
function validatePaymentWorkflow() {
  log('\n═══════════════════════════════════════════', 'cyan');
  log('        PAYMENT WORKFLOW VALIDATION', 'cyan');
  log('═══════════════════════════════════════════\n', 'cyan');

  const checks = [
    {
      name: 'HyperPay Initiate Route',
      file: 'app/routes/($locale).hyperpay.initiate.tsx',
      requiredEnv: ['HYPERPAY_ACCESS_TOKEN', 'HYPERPAY_ENTITY_ID_CARD'],
    },
    {
      name: 'HyperPay Callback Route',
      file: 'app/routes/($locale).hyperpay.callback.tsx',
      requiredEnv: ['HYPERPAY_ACCESS_TOKEN'],
    },
    {
      name: 'Tap Initiate Route',
      file: 'app/routes/($locale).tap.initiate.tsx',
      requiredEnv: ['TAP_SECRET_KEY'],
    },
    {
      name: 'Tap Callback Route',
      file: 'app/routes/($locale).tap.callback.tsx',
      requiredEnv: ['TAP_SECRET_KEY'],
    },
    {
      name: 'Tap Webhook Route',
      file: 'app/routes/($locale).tap.webhook.tsx',
      requiredEnv: ['TAP_SECRET_KEY'],
    },
  ];

  const envFile = fs.readFileSync(path.join(process.cwd(), '.env'), 'utf-8');

  for (const check of checks) {
    const fileExists = fs.existsSync(path.join(process.cwd(), check.file));
    const status = fileExists ? 'pass' : 'fail';
    
    log(`  ${fileExists ? '✓' : '✗'} ${check.name}`, fileExists ? 'green' : 'red');
    
    if (fileExists) {
      // Check environment variables
      const missingEnv = check.requiredEnv.filter((env) => {
        const regex = new RegExp(`^${env}=`, 'm');
        const hasValue = regex.test(envFile) && !envFile.includes(`${env}=`);
        const isPlaceholder = envFile.includes(`${env}=REPLACE`) || 
                              envFile.includes(`${env}=sk_test_REPLACE`) ||
                              envFile.includes(`${env}=YOUR_`);
        return !regex.test(envFile) || isPlaceholder;
      });

      if (missingEnv.length > 0) {
        log(`    ⚠ Missing/placeholder env: ${missingEnv.join(', ')}`, 'yellow');
      } else {
        log(`    ✓ Environment configured`, 'green');
      }
    }
    
    results.payment.push({
      test: check.name,
      status: fileExists ? 'pass' : 'fail',
    });
  }

  // Check Cart integration
  log('\n  Cart Payment Integration:', 'yellow');
  const cartFile = path.join(process.cwd(), 'app/components/Cart.tsx');
  if (fs.existsSync(cartFile)) {
    const cartContent = fs.readFileSync(cartFile, 'utf-8');
    
    const hasTapButton = cartContent.includes('TapPayCheckoutButton');
    const hasShopPay = cartContent.includes('ShopPayButton');
    const hasCheckoutUrl = cartContent.includes('checkoutUrl');
    
    log(`    ${hasTapButton ? '✓' : '✗'} Tap Payments button`, hasTapButton ? 'green' : 'red');
    log(`    ${hasShopPay ? '✓' : '✗'} Shop Pay button`, hasShopPay ? 'green' : 'red');
    log(`    ${hasCheckoutUrl ? '✓' : '✗'} Shopify checkout URL`, hasCheckoutUrl ? 'green' : 'red');
    
    results.payment.push({
      test: 'Cart Payment Integration',
      status: hasTapButton && hasShopPay && hasCheckoutUrl ? 'pass' : 'fail',
    });
  }

  // Payment flow analysis
  log('\n  Payment Flow Analysis:', 'yellow');
  log('    1. Customer clicks checkout → Cart.tsx', 'reset');
  log('    2. Option A: Shopify Checkout (standard)', 'reset');
  log('    3. Option B: Tap Payments → /tap/initiate', 'reset');
  log('    4. Tap redirects to hosted payment page', 'reset');
  log('    5. Customer completes payment on Tap', 'reset');
  log('    6. Tap redirects to /tap/callback', 'reset');
  log('    7. Server verifies payment status', 'reset');
  log('    8. Webhook receives S2S notification', 'reset');
}

// ============================================
// 4. ENVIRONMENT CONFIGURATION CHECK
// ============================================
function checkEnvironment() {
  log('\n═══════════════════════════════════════════', 'cyan');
  log('      ENVIRONMENT CONFIGURATION CHECK', 'cyan');
  log('═══════════════════════════════════════════\n', 'cyan');

  const requiredVars = [
    'PUBLIC_STOREFRONT_API_TOKEN',
    'PUBLIC_STORE_DOMAIN',
    'PRIVATE_STOREFRONT_API_TOKEN',
    'SESSION_SECRET',
    'PUBLIC_CHECKOUT_DOMAIN',
  ];

  const paymentVars = [
    'TAP_SECRET_KEY',
    'TAP_API_URL',
  ];

  const optionalVars = [
    'HYPERPAY_ACCESS_TOKEN',
    'HYPERPAY_ENTITY_ID_MADA',
    'HYPERPAY_ENTITY_ID_CARD',
    'HYPERPAY_BASE_URL',
  ];

  const envFile = fs.existsSync(path.join(process.cwd(), '.env'))
    ? fs.readFileSync(path.join(process.cwd(), '.env'), 'utf-8')
    : '';

  log('Required Shopify Variables:', 'yellow');
  for (const v of requiredVars) {
    const exists = envFile.includes(`${v}=`) && !envFile.includes(`${v}=\n`);
    const isPlaceholder = envFile.includes(`${v}=REPLACE`) || envFile.includes(`${v}=YOUR_`);
    const status = exists && !isPlaceholder ? 'configured' : 'missing';
    
    results.environment.push({variable: v, status});
    log(`  ${status === 'configured' ? '✓' : '✗'} ${v}`, status === 'configured' ? 'green' : 'red');
  }

  log('\nPayment Variables (Tap):', 'yellow');
  for (const v of paymentVars) {
    const exists = envFile.includes(`${v}=`);
    const isPlaceholder = envFile.includes(`${v}=REPLACE`) || envFile.includes(`${v}=sk_test_REPLACE`);
    const status = exists && !isPlaceholder ? 'configured' : 'missing';
    
    results.environment.push({variable: v, status});
    log(`  ${status === 'configured' ? '✓' : '✗'} ${v}`, status === 'configured' ? 'green' : 'red');
  }

  log('\nOptional HyperPay Variables:', 'yellow');
  for (const v of optionalVars) {
    const exists = envFile.includes(`${v}=`);
    const isPlaceholder = envFile.includes(`${v}=REPLACE`);
    const status = exists && !isPlaceholder ? 'configured' : 'missing';
    
    if (exists) {
      log(`  ${status === 'configured' ? '✓' : '⚠'} ${v}`, status === 'configured' ? 'green' : 'yellow');
    } else {
      log(`  ○ ${v} (not set)`, 'reset');
    }
  }
}

// ============================================
// 5. GENERATE TEST REPORT
// ============================================
function generateReport() {
  log('\n═══════════════════════════════════════════', 'cyan');
  log('           TEST SUMMARY REPORT', 'cyan');
  log('═══════════════════════════════════════════\n', 'cyan');

  const routePass = results.routes.filter((r) => r.status === 'pass').length;
  const routeTotal = results.routes.length;
  
  const paymentPass = results.payment.filter((p) => p.status === 'pass').length;
  const paymentTotal = results.payment.length;
  
  const envPass = results.environment.filter((e) => e.status === 'configured').length;
  const envTotal = results.environment.length;

  log(`Routes: ${routePass}/${routeTotal} passing`, routePass === routeTotal ? 'green' : 'yellow');
  log(`Payment: ${paymentPass}/${paymentTotal} passing`, paymentPass === paymentTotal ? 'green' : 'yellow');
  log(`Environment: ${envPass}/${envTotal} configured`, envPass === envTotal ? 'green' : 'yellow');
  log(`Images: ${results.images.filter((i) => i.oversized).length} oversized`, 
    results.images.filter((i) => i.oversized).length > 0 ? 'yellow' : 'green');

  // Save detailed report
  const reportPath = path.join(process.cwd(), 'test-report-detailed.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  log(`\n📄 Detailed report saved to: ${reportPath}`, 'blue');

  // Exit with appropriate code
  const allPass = routePass === routeTotal && 
                  paymentPass === paymentTotal && 
                  results.images.filter((i) => i.oversized).length === 0;
  
  return allPass;
}

// ============================================
// MAIN EXECUTION
// ============================================
function main() {
  log('\n╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║     FORMEHAUS HYDROGEN - COMPREHENSIVE TEST SUITE         ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝', 'cyan');

  try {
    const routeCount = validateRoutes();
    const imageStats = auditImages();
    validatePaymentWorkflow();
    checkEnvironment();
    const allPass = generateReport();

    log('\n═══════════════════════════════════════════', 'cyan');
    if (allPass) {
      log('   ✅ ALL CHECKS PASSED', 'green');
    } else {
      log('   ⚠️  SOME CHECKS NEED ATTENTION', 'yellow');
    }
    log('═══════════════════════════════════════════\n', 'cyan');

    process.exit(allPass ? 0 : 1);
  } catch (error) {
    log(`\n❌ Test suite failed: ${error}`, 'red');
    process.exit(1);
  }
}

main();
