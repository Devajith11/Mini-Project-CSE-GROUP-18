# GECW Admission System — Test Suite

**Framework:** Robot Framework + RequestsLibrary  
**Project:** Mini-Project-CSE-GROUP-18 (GECW Admission Management System)

---

## Project Under Test

A full-stack admission portal for Government Engineering College Wayanad with:
- **Backend:** Node.js + Express + MongoDB
- **Auth:** JWT-based, role-separated (student / admin)
- **Features:** Student registration, admission form, document upload, admin verification, keyword chatbot

---

## Test Suite Structure

```
tests/
├── run_tests.sh                          # One-click runner
├── resources/
│   └── common.resource                   # Shared keywords & variables
├── unit/
│   ├── test_auth.robot                   # 17 tests — Auth module
│   ├── test_student.robot                # 14 tests — Student module
│   ├── test_admin.robot                  # 10 tests — Admin module
│   └── test_chatbot.robot                # 15 tests — Chatbot module
└── integration/
    ├── test_admission_workflow.robot      # 13 tests — Full admission journey
    ├── test_document_verification.robot   # 7 tests  — Document lifecycle
    └── test_chatbot_combined.robot        # 9 tests  — Chatbot + Admission
```

**Total: 85 test cases**

---

## Test Coverage Summary

### Unit Tests

| File | Module | Cases | What's Tested |
|------|--------|-------|---------------|
| `test_auth.robot` | Auth | 17 | Register, login, password reset, admin login, JWT structure, duplicate detection |
| `test_student.robot` | Student | 14 | Profile GET, personal/academic/branch updates, upload validation, role enforcement |
| `test_admin.robot` | Admin | 10 | List students, verify documents, update status, remarks, role enforcement |
| `test_chatbot.robot` | Chatbot | 15 | Keyword matching, fallback, case-insensitivity, seed, add intent, get all |

### Integration Tests

| File | Scenario | Cases | What's Tested |
|------|----------|-------|---------------|
| `test_admission_workflow.robot` | Full Admission Journey | 13 | Register → Login → Fill Form → Admin Review → Admit |
| `test_document_verification.robot` | Document Lifecycle | 7 | Upload → Pending → Verify/Reject → Student Sees Status |
| `test_chatbot_combined.robot` | Chatbot + Admission | 9 | Pre-registration queries → Register → Post-login queries |

---

## Tags Reference

Run any subset of tests using `--include <tag>`:

| Tag | What it selects |
|-----|----------------|
| `smoke` | Critical happy-path tests only |
| `unit` | All unit tests |
| `integration` | All integration tests |
| `auth` | Authentication tests |
| `student` | Student module tests |
| `admin` | Admin module tests |
| `chatbot` | Chatbot tests |
| `positive` | Happy-path tests |
| `negative` | Error/failure tests |
| `security` | Auth enforcement / role tests |
| `validation` | Input validation tests |
| `workflow` | Step-by-step workflow tests |

---

## Prerequisites

1. **Python 3.8+** installed
2. **Robot Framework dependencies:**
   ```bash
   pip install robotframework robotframework-requests robotframework-jsonlibrary
   ```
3. **Backend running:**
   ```bash
   cd backend
   cp .env.example .env       # set MONGO_URI and JWT_SECRET
   npm install
   npm run dev                # starts on port 5001
   ```
4. **MongoDB** running and accessible (local or Atlas)

---

## Running the Tests

### Full suite (recommended)
```bash
cd tests
bash run_tests.sh
```

### Unit tests only
```bash
robot --outputdir reports/unit unit/
```

### Integration tests only
```bash
robot --outputdir reports/integration integration/
```

### Smoke tests only (fast sanity check)
```bash
robot --include smoke --outputdir reports/smoke unit/ integration/
```

### Single file
```bash
robot --outputdir reports unit/test_auth.robot
```

### Security tests only
```bash
robot --include security --outputdir reports/security unit/ integration/
```

---

## Report Output

After running, Robot Framework generates:

| File | Description |
|------|-------------|
| `reports/combined_report.html` | Top-level pass/fail summary |
| `reports/combined_log.html` | Detailed step-by-step execution log |
| `reports/unit/unit_report.html` | Unit test report |
| `reports/integration/integration_report.html` | Integration test report |

Open any `.html` file in a browser — no server needed.

---

## Sample Expected Results

### Unit Tests (all passing)
```
==============================================================================
GECW Unit Tests
==============================================================================
Auth                                                                | 17 tests, 17 passed
Student                                                             | 14 tests, 14 passed
Admin                                                               | 10 tests, 10 passed
Chatbot                                                             | 15 tests, 15 passed
------------------------------------------------------------------------------
GECW Unit Tests                                                     | 56 tests, 56 passed
==============================================================================
```

### Integration Tests (all passing)
```
==============================================================================
GECW Integration Tests
==============================================================================
Admission Workflow                                                  | 13 tests, 13 passed
Document Verification                                               | 7 tests,  7 passed
Chatbot Combined                                                    | 9 tests,  9 passed
------------------------------------------------------------------------------
GECW Integration Tests                                              | 29 tests, 29 passed
==============================================================================
```

---

## Key Design Decisions

### Why Robot Framework?
- Human-readable `.robot` test files (assessors can read tests without coding knowledge)
- Built-in HTML reporting with pass/fail colours
- `RequestsLibrary` provides clean REST API testing keywords
- Tags allow selective execution (smoke, regression, security)
- `Suite Setup` / `Suite Teardown` manage shared state cleanly

### Test Isolation
- Each suite registers its own unique test student (e.g., `UNIT_AUTH_001`, `INT_FLOW_001`)
- `expected_status=any` is used where a 400 on re-run (duplicate) is acceptable
- Admin account (`admin_gecw`) is seeded by the backend on startup — no setup needed

### Integration Test Ordering
Integration tests are numbered (`TC-INT-001` through `TC-INT-013`) and designed to run in order — each step builds on the previous one's state. This mirrors a real admission workflow.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `ConnectionRefusedError` | Backend not running — `cd backend && npm run dev` |
| `400 Already registered` on re-run | Expected — tests handle duplicate registration gracefully |
| `401 No token` in admin tests | Check `Suite Setup` ran — it sets `${ADMIN_TOKEN}` |
| `404` on `/api/chatbot/seed` | Seed route may need a prior GET to `/api/chatbot/all` |
| MongoDB connection error | Check `.env` MONGO_URI is correct |
