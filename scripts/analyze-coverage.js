#!/usr/bin/env node

/**
 * Test Coverage Analysis Script
 * 
 * This script analyzes Jest coverage reports and provides insights 
 * on test coverage trends and areas for improvement.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const CONFIG = {
  coverageThreshold: 80, // Minimum acceptable coverage percentage
  criticalFiles: [], // Files that must maintain high coverage
  coverageSummaryPath: './coverage/coverage-summary.json',
  previousCoveragePath: './coverage-history/previous-coverage.json',
  coverageHistoryDir: './coverage-history',
};

// Create coverage history directory if it doesn't exist
if (!fs.existsSync(CONFIG.coverageHistoryDir)) {
  fs.mkdirSync(CONFIG.coverageHistoryDir, { recursive: true });
}

/**
 * Run tests and generate coverage
 */
function generateCoverage() {
  console.log('Running tests and generating coverage...');
  try {
    execSync('npm test -- --coverage --watchAll=false', { stdio: 'inherit' });
    console.log('Coverage generated successfully!');
    return true;
  } catch (error) {
    console.error('Error generating coverage:', error.message);
    return false;
  }
}

/**
 * Read coverage data from JSON file
 */
function readCoverageData(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error(`Error reading coverage data from ${filePath}:`, error.message);
  }
  return null;
}

/**
 * Save current coverage data as previous for future comparison
 */
function saveCoverageHistory(data) {
  try {
    fs.writeFileSync(
      path.join(CONFIG.coverageHistoryDir, 'previous-coverage.json'),
      JSON.stringify(data, null, 2)
    );
    
    // Also save a timestamped version
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    fs.writeFileSync(
      path.join(CONFIG.coverageHistoryDir, `coverage-${timestamp}.json`),
      JSON.stringify(data, null, 2)
    );
    
    console.log('Coverage history saved.');
  } catch (error) {
    console.error('Error saving coverage history:', error.message);
  }
}

/**
 * Compare current coverage with previous coverage
 */
function compareCoverage(current, previous) {
  if (!previous) return null;
  
  const results = {
    overall: {
      current: current.total.lines.pct,
      previous: previous.total.lines.pct,
      change: current.total.lines.pct - previous.total.lines.pct
    },
    files: {}
  };
  
  // Compare individual files
  Object.keys(current).forEach(file => {
    if (file === 'total') return;
    
    if (previous[file]) {
      results.files[file] = {
        current: current[file].lines.pct,
        previous: previous[file].lines.pct,
        change: current[file].lines.pct - previous[file].lines.pct
      };
    } else {
      results.files[file] = {
        current: current[file].lines.pct,
        previous: 0,
        change: current[file].lines.pct,
        isNew: true
      };
    }
  });
  
  return results;
}

/**
 * Identify areas for improvement
 */
function findImprovementAreas(coverageData) {
  const lowCoverageFiles = [];
  const uncoveredLines = {};
  
  Object.keys(coverageData).forEach(file => {
    if (file === 'total') return;
    
    const fileCoverage = coverageData[file];
    
    // Check if file has low coverage
    if (fileCoverage.lines.pct < CONFIG.coverageThreshold) {
      lowCoverageFiles.push({
        file,
        coverage: fileCoverage.lines.pct,
        gap: CONFIG.coverageThreshold - fileCoverage.lines.pct
      });
      
      // Collect uncovered lines
      const lines = [];
      Object.keys(fileCoverage.statementMap).forEach(stmtId => {
        if (!fileCoverage.s[stmtId]) {
          const loc = fileCoverage.statementMap[stmtId].loc;
          lines.push(`${loc.start.line}-${loc.end.line}`);
        }
      });
      
      if (lines.length > 0) {
        uncoveredLines[file] = lines;
      }
    }
  });
  
  return {
    lowCoverageFiles: lowCoverageFiles.sort((a, b) => a.gap - b.gap),
    uncoveredLines
  };
}

/**
 * Print report to console
 */
function printReport(currentCoverage, comparison, improvements) {
  console.log('\n========== COVERAGE REPORT ==========\n');
  
  // Print overall coverage
  console.log(`Overall Coverage: ${currentCoverage.total.lines.pct.toFixed(2)}%`);
  console.log(`Statement Coverage: ${currentCoverage.total.statements.pct.toFixed(2)}%`);
  console.log(`Branch Coverage: ${currentCoverage.total.branches.pct.toFixed(2)}%`);
  console.log(`Function Coverage: ${currentCoverage.total.functions.pct.toFixed(2)}%`);
  
  // Print comparison if available
  if (comparison) {
    const changeSymbol = comparison.overall.change >= 0 ? '▲' : '▼';
    const changeColor = comparison.overall.change >= 0 ? '\x1b[32m' : '\x1b[31m';
    
    console.log(`\nCoverage Change: ${changeColor}${changeSymbol} ${Math.abs(comparison.overall.change).toFixed(2)}%\x1b[0m`);
    
    // Print top 5 improved and declined files
    const files = Object.entries(comparison.files)
      .map(([file, data]) => ({ file, ...data }));
    
    const improved = files
      .filter(f => f.change > 0)
      .sort((a, b) => b.change - a.change)
      .slice(0, 5);
    
    const declined = files
      .filter(f => f.change < 0)
      .sort((a, b) => a.change - b.change)
      .slice(0, 5);
    
    if (improved.length > 0) {
      console.log('\nMost Improved Files:');
      improved.forEach(f => {
        console.log(`  ${f.file}: \x1b[32m▲ ${f.change.toFixed(2)}%\x1b[0m (${f.previous.toFixed(2)}% → ${f.current.toFixed(2)}%)`);
      });
    }
    
    if (declined.length > 0) {
      console.log('\nFiles with Declining Coverage:');
      declined.forEach(f => {
        console.log(`  ${f.file}: \x1b[31m▼ ${Math.abs(f.change).toFixed(2)}%\x1b[0m (${f.previous.toFixed(2)}% → ${f.current.toFixed(2)}%)`);
      });
    }
  }
  
  // Print improvement areas
  if (improvements.lowCoverageFiles.length > 0) {
    console.log('\nFiles Below Threshold:');
    improvements.lowCoverageFiles.forEach(f => {
      console.log(`  ${f.file}: ${f.coverage.toFixed(2)}% (${f.gap.toFixed(2)}% below threshold)`);
    });
  }
  
  console.log('\n======================================\n');
}

/**
 * Main function
 */
async function main() {
  // Generate coverage
  if (!generateCoverage()) {
    process.exit(1);
  }
  
  // Read current coverage data
  const currentCoverage = readCoverageData(CONFIG.coverageSummaryPath);
  if (!currentCoverage) {
    console.error('Could not read current coverage data. Make sure tests have run successfully.');
    process.exit(1);
  }
  
  // Read previous coverage data (if available)
  const previousCoverage = readCoverageData(CONFIG.previousCoveragePath);
  
  // Compare with previous coverage
  const comparison = compareCoverage(currentCoverage, previousCoverage);
  
  // Find areas for improvement
  const improvements = findImprovementAreas(currentCoverage);
  
  // Print report
  printReport(currentCoverage, comparison, improvements);
  
  // Save current coverage as previous for future comparison
  saveCoverageHistory(currentCoverage);
}

// Run the script
main(); 