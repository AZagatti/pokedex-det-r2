#!/bin/bash

# Run Lighthouse audit on the production build
# This requires the build to be running via 'npm run preview'

echo "Starting Lighthouse audit..."

# Create an audit report directory
mkdir -p audit-reports

# Run Lighthouse using Chrome DevTools
npx lighthouse http://localhost:4173 \
  --chrome-flags="--headless=new" \
  --output-path=./audit-reports/lighthouse-report.html \
  --output=html \
  --view=false

echo "Lighthouse audit complete! Report saved to audit-reports/lighthouse-report.html"
