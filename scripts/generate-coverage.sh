#!/bin/bash
# Script to generate test coverage report

# Set default output directory
OUTPUT_DIR="coverage-report"
HTML_REPORT=false
SUMMARY_ONLY=false

# Parse command line arguments
while getopts "o:hs" opt; do
  case $opt in
    o) OUTPUT_DIR="$OPTARG" ;;
    h) HTML_REPORT=true ;;
    s) SUMMARY_ONLY=true ;;
    \?) echo "Invalid option -$OPTARG" >&2; exit 1 ;;
  esac
done

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

echo "Generating test coverage report..."

# Run tests with coverage
if [ "$SUMMARY_ONLY" = true ]; then
  # Run with summary only
  npm test -- --coverage --watchAll=false --coverageReporters="text-summary" | tee "$OUTPUT_DIR/coverage-summary.txt"
else
  # Run with full coverage
  npm test -- --coverage --watchAll=false | tee "$OUTPUT_DIR/coverage-summary.txt"
  
  # Copy coverage reports
  if [ -d "coverage" ]; then
    cp -r coverage/* "$OUTPUT_DIR/"
  fi
fi

# Extract overall coverage percentage
COVERAGE_PCT=$(grep "All files" "$OUTPUT_DIR/coverage-summary.txt" | awk '{print $4}')

echo "----------------------------------------"
echo "Test coverage report generated in $OUTPUT_DIR"
echo "Overall coverage: $COVERAGE_PCT"
echo "----------------------------------------"

# Open HTML report if requested
if [ "$HTML_REPORT" = true ] && [ -f "$OUTPUT_DIR/lcov-report/index.html" ]; then
  echo "Opening HTML report..."
  
  # Detect operating system and open the report accordingly
  case "$(uname -s)" in
    Darwin*)    open "$OUTPUT_DIR/lcov-report/index.html" ;;
    Linux*)     xdg-open "$OUTPUT_DIR/lcov-report/index.html" ;;
    CYGWIN*|MINGW*) start "$OUTPUT_DIR/lcov-report/index.html" ;;
    *)          echo "Unknown OS, cannot open HTML report automatically." ;;
  esac
fi

exit 0 