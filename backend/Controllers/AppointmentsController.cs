using System.Security.Claims;
using backend.Data;
using backend.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/appointments")]
    [Authorize]
    public class AppointmentsController : ControllerBase
    {
        private readonly IAppointmentService _appointmentService;
        private readonly IVisitRecordService _visitRecordService;
        private readonly AppDbContext _context;

        public AppointmentsController(
            IAppointmentService appointmentService,
            IVisitRecordService visitRecordService,
            AppDbContext context)
        {
            _appointmentService = appointmentService;
            _visitRecordService = visitRecordService;
            _context = context;
        }

        private int GetUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
            return int.Parse(claim);
        }

        private async Task<int?> GetPatientIdAsync()
        {
            var userId = GetUserId();
            var patient = await _context.Patients.FirstOrDefaultAsync(p => p.UserId == userId);
            return patient?.Id;
        }

        private async Task<int?> GetDoctorIdAsync()
        {
            var userId = GetUserId();
            var doctor = await _context.Doctors.FirstOrDefaultAsync(d => d.UserId == userId);
            return doctor?.Id;
        }

        [HttpGet("available-slots")]
        public async Task<IActionResult> GetAvailableSlots([FromQuery] int doctorId, [FromQuery] DateTime date)
        {
            var slots = await _appointmentService.GetAvailableSlotsAsync(doctorId, date);
            return Ok(slots);
        }

        [Authorize(Roles = "Patient")]
        [HttpPost]
        public async Task<IActionResult> Create(CreateAppointmentRequest request)
        {
            var patientId = await GetPatientIdAsync();
            if (patientId == null)
            {
                return BadRequest(new { message = "Patient profile not found." });
            }

            var appointment = await _appointmentService.CreateAsync(patientId.Value, request);
            if (appointment == null)
            {
                return Conflict(new { message = "The selected appointment slot is no longer available." });
            }

            return Ok(appointment);
        }

        [Authorize(Roles = "Patient")]
        [HttpGet("my")]
        public async Task<IActionResult> GetMyAppointments()
        {
            var patientId = await GetPatientIdAsync();
            if (patientId == null)
            {
                return BadRequest(new { message = "Patient profile not found." });
            }

            var appointments = await _appointmentService.GetMyAppointmentsAsync(patientId.Value);
            return Ok(appointments);
        }

        [Authorize(Roles = "Patient")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Cancel(int id)
        {
            var patientId = await GetPatientIdAsync();
            if (patientId == null)
            {
                return BadRequest(new { message = "Patient profile not found." });
            }

            var success = await _appointmentService.CancelAsync(id, patientId.Value);
            if (!success)
            {
                return NotFound(new { message = "Appointment not found or cannot be cancelled." });
            }

            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var appointments = await _appointmentService.GetAllAsync();
            return Ok(appointments);
        }

        [Authorize(Roles = "Doctor")]
        [HttpGet("doctor")]
        public async Task<IActionResult> GetDoctorAppointments()
        {
            var doctorId = await GetDoctorIdAsync();
            if (doctorId == null)
            {
                return BadRequest(new { message = "Doctor profile not found." });
            }

            var appointments = await _appointmentService.GetDoctorAppointmentsAsync(doctorId.Value);
            return Ok(appointments);
        }

        [Authorize(Roles = "Doctor")]
        [HttpPost("{id}/complete")]
        public async Task<IActionResult> CompleteVisit(int id, CreateVisitRecordRequest request)
        {
            var doctorId = await GetDoctorIdAsync();
            if (doctorId == null)
            {
                return BadRequest(new { message = "Doctor profile not found." });
            }

            var visitRecord = await _visitRecordService.CompleteVisitAsync(id, doctorId.Value, request);
            if (visitRecord == null)
            {
                return NotFound(new { message = "Appointment not found, not yours, or already completed." });
            }

            return Ok(visitRecord);
        }
    }
}