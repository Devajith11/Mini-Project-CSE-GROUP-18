#!/bin/bash
# =============================================================================
#  GECW Admission System — Robot Framework Test Runner
#  Run this script from the tests/ directory (or adjust paths accordingly)
# =============================================================================

set -e
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  GECW Test Suite — Robot Framework    ${NC}"
echo -e "${GREEN}========================================${NC}"

# ── 1. Install dependencies ──────────────────────────────────────────────────
echo -e "\n${YELLOW}[1/4] Installing Python dependencies...${NC}"
pip install robotframework robotframework-requests robotframework-jsonlibrary -q

echo -e "${GREEN}✔  Dependencies installed.${NC}"

# ── 2. Verify backend is reachable ───────────────────────────────────────────
echo -e "\n${YELLOW}[2/4] Checking backend connectivity...${NC}"
if curl -s --max-time 5 http://localhost:5001/ > /dev/null; then
    echo -e "${GREEN}✔  Backend reachable at http://localhost:5001${NC}"
else
    echo -e "${RED}✗  Backend not reachable! Start the backend first:${NC}"
    echo -e "       cd backend && npm install && npm run dev"
    echo ""
    echo -e "   Then re-run this script."
    exit 1
fi

# ── 3. Create output directory ───────────────────────────────────────────────
mkdir -p reports

# ── 4. Run tests ─────────────────────────────────────────────────────────────
echo -e "\n${YELLOW}[3/4] Running Unit Tests...${NC}"
robot \
  --outputdir reports/unit \
  --output unit_output.xml \
  --log unit_log.html \
  --report unit_report.html \
  --name "GECW Unit Tests" \
  unit/

echo -e "\n${YELLOW}[4/4] Running Integration Tests...${NC}"
robot \
  --outputdir reports/integration \
  --output integration_output.xml \
  --log integration_log.html \
  --report integration_report.html \
  --name "GECW Integration Tests" \
  integration/

# ── Merge reports ────────────────────────────────────────────────────────────
echo -e "\n${YELLOW}Merging all reports...${NC}"
rebot \
  --outputdir reports \
  --output combined_output.xml \
  --log combined_log.html \
  --report combined_report.html \
  --name "GECW Full Test Suite" \
  reports/unit/unit_output.xml \
  reports/integration/integration_output.xml

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  All tests complete!                  ${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "📄 Reports generated in:  $(pwd)/reports/"
echo -e "   - Combined:             reports/combined_report.html"
echo -e "   - Unit only:            reports/unit/unit_report.html"
echo -e "   - Integration only:     reports/integration/integration_report.html"
echo ""

# ── Optional: Run specific tags only ─────────────────────────────────────────
# To run only smoke tests:
#   robot --include smoke --outputdir reports unit/ integration/
#
# To run only security tests:
#   robot --include security --outputdir reports unit/ integration/
#
# To run a single file:
#   robot --outputdir reports unit/test_auth.robot
