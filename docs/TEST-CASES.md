# Test Case Document - Clinic Management System

This document lists functional and negative test cases executed against the API (via Postman/Swagger) and the frontend (manual UI testing), covering authentication, authorization, and core business rules.

## Authentication

| ID | Test Case | Preconditions | Steps | Expected Result | Actual Result |
|---|---|---|---|---|---|
| TC-001 | Patient registration | None | POST /api/auth/register with valid data | 200 OK, JWT token returned | Pass |
| TC-002 | Duplicate email registration | Email already registered | POST /api/auth/register with existing email | 409 Conflict | Pass |
| TC-003 | Valid login | Registered account exists | POST /api/auth/login with correct credentials | 200 OK, JWT token returned | Pass |
| TC-004 | Invalid password login | Registered account exists | POST /api/auth/login with wrong password | 401 Unauthorized | Pass |

## Authorization (Role-Based Access)

| ID | Test Case | Preconditions | Steps | Expected Result | Actual Result |
|---|---|---|---|---|---|
| TC-005 | Admin creates doctor | Logged in as Admin | POST /api/doctors with valid data | 201 Created | Pass |
| TC-006 | Patient attempts to create doctor | Logged in as Patient | POST /api/doctors | 403 Forbidden | Pass |
| TC-007 | Unauthenticated request to protected endpoint | No token provided | POST /api/doctors with no Authorization header | 401 Unauthorized | Pass |
| TC-008 | Doctor attempts to cancel appointment (wrong role) | Logged in as Doctor | DELETE /api/appointments/{id} | 403 Forbidden | Pass |
| TC-009 | Patient attempts to view dashboard stats | Logged in as Patient | GET /api/dashboard/stats | 403 Forbidden | Pass |

## Doctor Management

| ID | Test Case | Preconditions | Steps | Expected Result | Actual Result |
|---|---|---|---|---|---|
| TC-010 | Create doctor with duplicate email | Doctor with that email exists | POST /api/doctors with existing email | 409 Conflict | Pass |
| TC-011 | Get doctor by nonexistent ID | None | GET /api/doctors/9999 | 404 Not Found | Pass |
| TC-012 | View all doctors (public) | None | GET /api/doctors | 200 OK, list returned | Pass |

## Schedules

| ID | Test Case | Preconditions | Steps | Expected Result | Actual Result |
|---|---|---|---|---|---|
| TC-013 | Create valid schedule | Doctor exists, logged in as Admin | POST /api/doctors/{id}/schedules with valid time range | 201 Created | Pass |
| TC-014 | Create schedule with end time before start time | Logged in as Admin | POST with startTime > endTime | 400 Bad Request | Pass |

## Appointment Booking

| ID | Test Case | Preconditions | Steps | Expected Result | Actual Result |
|---|---|---|---|---|---|
| TC-015 | View available slots | Doctor has a schedule for that day | GET /api/appointments/available-slots?doctorId&date | 200 OK, list of open time slots | Pass |
| TC-016 | Book an available slot | Slot is open | POST /api/appointments with valid slot | 200 OK, appointment created (Scheduled) | Pass |
| TC-017 | Book an already-booked slot | Slot was just booked | POST /api/appointments with same doctor/date/time | 409 Conflict | Pass |
| TC-018 | View my appointments | Patient has bookings | GET /api/appointments/my | 200 OK, list includes booking | Pass |
| TC-019 | Cancel a scheduled appointment | Appointment is Scheduled, owned by patient | DELETE /api/appointments/{id} | 204 No Content, status becomes Cancelled | Pass |
| TC-020 | Cancel another patient's appointment (ownership) | Appointment belongs to different patient | DELETE /api/appointments/{id} as wrong patient/role | 403 Forbidden (blocked at role level) | Pass |

## Visit Records

| ID | Test Case | Preconditions | Steps | Expected Result | Actual Result |
|---|---|---|---|---|---|
| TC-021 | Complete a scheduled visit with notes | Appointment is Scheduled, owned by doctor | POST /api/appointments/{id}/complete with notes | 200 OK, status becomes Completed, VisitRecord created | Pass |
| TC-022 | Complete an already-completed visit | Appointment already Completed | POST /api/appointments/{id}/complete again | 404 Not Found | Pass |
| TC-023 | Patient views visit history | Patient has completed visits | GET /api/visits/my | 200 OK, notes visible | Pass |

## Admin Dashboard

| ID | Test Case | Preconditions | Steps | Expected Result | Actual Result |
|---|---|---|---|---|---|
| TC-024 | View dashboard statistics | Logged in as Admin | GET /api/dashboard/stats | 200 OK, totals and breakdowns returned | Pass |

## Frontend UI

| ID | Test Case | Preconditions | Steps | Expected Result | Actual Result |
|---|---|---|---|---|---|
| TC-025 | Login form validation | None | Submit login form with empty fields | Browser-native required-field validation blocks submit | Pass |
| TC-026 | Protected route redirect (unauthenticated) | Not logged in | Navigate to /admin/doctors directly | Redirected to /login | Pass |
| TC-027 | Protected route redirect (wrong role) | Logged in as Patient | Navigate to /admin/doctors directly | Redirected to /login | Pass |
| TC-028 | Role-based post-login redirect | N/A | Log in as Doctor / Admin / Patient | Redirected to the correct respective dashboard | Pass |
| TC-029 | Booking flow end-to-end | Logged in as Patient | Select doctor, pick date, pick slot, confirm | Success message shown, slot removed from list | Pass |
| TC-030 | Doctor completes visit via UI | Logged in as Doctor, has a Scheduled appointment | Click "Complete Visit", enter notes, save | Status updates to Completed in the list | Pass |

---

**Notes:**
- All API test cases above are also automated as requests in the Postman collection (`postman/Clinic Management System API.postman_collection.json`), organized by resource folder.
- Test cases follow both positive (happy path) and negative (expected failure) scenarios per test category, per the project's testing requirements.
