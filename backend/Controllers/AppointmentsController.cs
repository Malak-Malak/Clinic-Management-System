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
        private readonly AppDbContext _context;

        public AppointmentsController(IAppointmentService appointmentService, AppDbContext context)
        {
            _appointmentService = appointmentService;
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
    }
}