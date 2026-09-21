# Bug Reports - Clinic Management System

---

## BUG-001

### Title
Login and Register form labels not associated with their input fields

### Environment
Browser: Chrome / Edge
OS: Windows
Environment: Development

### Preconditions
None. Occurs on any visit to the Login or Register page.

### Steps to Reproduce
1. Open the Login or Register page.
2. Click directly on the text of a field label (e.g. "Email").
3. Attempt to query or focus the associated input using its label (e.g. via a screen reader, or a testing tool using `getByLabelText`).

### Expected Result
Clicking a label should focus its corresponding input field, and any tool or assistive technology that looks up an input by its label text should successfully find it.

### Actual Result
Labels were plain `<label>` elements with no `htmlFor` attribute, and inputs had no matching `id`. Clicking the label text did nothing, and automated tests using `getByLabelText` failed with `TestingLibraryElementError: Found a label... however no form control was found associated to that label`.

### Severity
Low

### Priority
Medium

### Root Cause
`<label>` and `<input>` elements were written without the `htmlFor`/`id` pairing required by HTML to formally associate them.

### Fix
Added matching `htmlFor` (label) and `id` (input) attributes to every field in `Login.jsx` and `Register.jsx`.

### Status
Fixed and verified via automated Vitest test suite.

---

## BUG-002

### Title
Booking an appointment fails with 500 Internal Server Error due to DateTime Kind mismatch

### Environment
Backend: ASP.NET Core 9 / PostgreSQL 18
Environment: Development

### Preconditions
Patient is logged in. Doctor has an active schedule with available slots.

### Steps to Reproduce
1. Log in as a Patient.
2. Call `POST /api/appointments/available-slots` or `POST /api/appointments` with a `date`/`appointmentDate` value that has no explicit UTC designation (e.g. `"2026-09-21T00:00:00"`).
3. Observe the server response.

### Expected Result
The request should succeed and return the available slots or the created appointment.

### Actual Result
The API returned `500 Internal Server Error` with:
`System.ArgumentException: Cannot write DateTime with Kind=Unspecified to PostgreSQL type 'timestamp with time zone', only UTC is supported.`

### Severity
High

### Priority
High

### Root Cause
Incoming `DateTime` values from query parameters and request bodies default to `DateTimeKind.Unspecified`. Npgsql (the PostgreSQL driver) refuses to persist or compare `Unspecified`-kind DateTimes against a `timestamptz` column.

### Fix
Explicitly converted incoming dates with `DateTime.SpecifyKind(date, DateTimeKind.Utc)` before using them in any EF Core query or entity assignment, in both `AppointmentService.GetAvailableSlotsAsync` and `CreateAsync`.

### Status
Fixed and verified via Swagger and Postman (booking, cancellation, and conflict test cases all pass).

---

## BUG-003

### Title
Navbar "My Appointments" link rendered nested inside the "Doctors" link, breaking navigation

### Environment
Frontend: React 19 / Vite
Browser: Chrome
Environment: Development

### Preconditions
Logged in as a Patient.

### Steps to Reproduce
1. Log in as a Patient.
2. Observe the navbar at the top of the page.
3. Attempt to click "Doctors" or "My Appointments".

### Expected Result
Two separate, independently clickable navigation links: "Doctors" and "My Appointments", each navigating to their own route.

### Actual Result
The "My Appointments" `<Link>` JSX was pasted inside the "Doctors" `<Link>` element instead of after it, producing invalid nested anchor markup. The navbar visually displayed both labels merged together, and navigation behavior was unreliable.

### Severity
Medium

### Priority
High

### Root Cause
Manual code edit inserted new JSX in the wrong location within the file, nesting one `<Link>` component inside another.

### Fix
Rewrote `Navbar.jsx` with the two `<Link>` elements as siblings, each with its own route and label.

### Status
Fixed and verified by manual UI testing (each link navigates correctly to its own route).
