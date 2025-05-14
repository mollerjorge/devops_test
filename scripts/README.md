# Test Coverage Scripts

This directory contains scripts for generating and analyzing test coverage in your project.

## Available Scripts

### `generate-coverage.sh`

A simple shell script that runs tests with coverage and outputs a summary.

```bash
# Basic usage
./scripts/generate-coverage.sh

# Output to custom directory
./scripts/generate-coverage.sh -o custom-coverage-dir

# Generate summary only
./scripts/generate-coverage.sh -s

# Generate and open HTML report
./scripts/generate-coverage.sh -h
```

### `analyze-coverage.js`

A more advanced Node.js script that analyzes coverage data, compares it with previous runs, and provides insights on areas for improvement.

```bash
# Run the analysis
node scripts/analyze-coverage.js
```

This script:
- Runs tests with coverage
- Compares current coverage with previous runs
- Identifies files below the coverage threshold (default 80%)
- Shows the most improved and declining files
- Saves a history of coverage reports for tracking over time

## Integration with GitHub Actions

These scripts can be integrated with the GitHub Actions workflow (`test-coverage.yml`) to provide more detailed analysis in PR comments.

Example workflow usage:
```yaml
- name: Generate detailed coverage report
  run: node scripts/analyze-coverage.js
```

## Configuration

You can modify the configuration in `analyze-coverage.js` to:
- Change the coverage threshold
- Define critical files that must maintain high coverage
- Change the paths for coverage reports and history 