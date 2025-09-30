#!/usr/bin/env node

/**
 * Test runner script for Go Home Tanuki
 * Provides additional test utilities and reporting
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Test configuration
const TEST_CONFIG = {
    coverageThreshold: {
        global: {
            branches: 70,
            functions: 70,
            lines: 70,
            statements: 70,
        },
    },
    testPatterns: [
        'src/**/*.test.js',
        'src/**/__tests__/**/*.js',
    ],
};

/**
 * Run all tests with coverage
 */
function runTestsWithCoverage() {
    console.log('🧪 Running tests with coverage...\n');

    try {
        execSync('npm run test:coverage', {
            stdio: 'inherit',
            cwd: process.cwd()
        });
        console.log('\n✅ All tests passed!');
    } catch (error) {
        console.error('\n❌ Tests failed:', error.message);
        process.exit(1);
    }
}

/**
 * Run tests in watch mode
 */
function runTestsWatch() {
    console.log('👀 Running tests in watch mode...\n');

    try {
        execSync('npm run test:watch', {
            stdio: 'inherit',
            cwd: process.cwd()
        });
    } catch (error) {
        console.error('\n❌ Watch mode failed:', error.message);
        process.exit(1);
    }
}

/**
 * Generate test report
 */
function generateTestReport() {
    const coveragePath = path.join(process.cwd(), 'coverage', 'lcov-report', 'index.html');

    if (fs.existsSync(coveragePath)) {
        console.log(`📊 Coverage report generated at: ${coveragePath}`);
        console.log('Open this file in your browser to view detailed coverage information.');
    } else {
        console.log('📊 No coverage report found. Run tests with coverage first.');
    }
}

/**
 * Check test coverage thresholds
 */
function checkCoverageThresholds() {
    const coveragePath = path.join(process.cwd(), 'coverage', 'coverage-summary.json');

    if (!fs.existsSync(coveragePath)) {
        console.log('❌ No coverage summary found. Run tests with coverage first.');
        return false;
    }

    const coverage = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
    const thresholds = TEST_CONFIG.coverageThreshold.global;

    let allPassed = true;

    console.log('\n📈 Coverage Threshold Check:');
    console.log('============================');

    Object.keys(thresholds).forEach(metric => {
        const actual = coverage.total[metric].pct;
        const threshold = thresholds[metric];
        const status = actual >= threshold ? '✅' : '❌';

        console.log(`${status} ${metric}: ${actual.toFixed(2)}% (threshold: ${threshold}%)`);

        if (actual < threshold) {
            allPassed = false;
        }
    });

    return allPassed;
}

/**
 * Main function
 */
function main() {
    const args = process.argv.slice(2);
    const command = args[0];

    switch (command) {
        case 'coverage':
            runTestsWithCoverage();
            if (checkCoverageThresholds()) {
                console.log('\n🎉 All coverage thresholds met!');
            } else {
                console.log('\n⚠️  Some coverage thresholds not met.');
                process.exit(1);
            }
            break;

        case 'watch':
            runTestsWatch();
            break;

        case 'report':
            generateTestReport();
            break;

        case 'check':
            if (checkCoverageThresholds()) {
                console.log('\n🎉 All coverage thresholds met!');
            } else {
                console.log('\n⚠️  Some coverage thresholds not met.');
                process.exit(1);
            }
            break;

        default:
            console.log('Go Home Tanuki Test Runner');
            console.log('==========================');
            console.log('');
            console.log('Usage: node test-runner.js <command>');
            console.log('');
            console.log('Commands:');
            console.log('  coverage  Run tests with coverage and check thresholds');
            console.log('  watch     Run tests in watch mode');
            console.log('  report    Generate test report');
            console.log('  check     Check coverage thresholds only');
            console.log('');
            console.log('Examples:');
            console.log('  node test-runner.js coverage');
            console.log('  node test-runner.js watch');
            console.log('  node test-runner.js report');
            break;
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = {
    runTestsWithCoverage,
    runTestsWatch,
    generateTestReport,
    checkCoverageThresholds,
};
