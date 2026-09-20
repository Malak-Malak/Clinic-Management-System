using backend.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/doctors")]
    public class DoctorsController : ControllerBase
    {
        private readonly IDoctorService _doctorService;

        public DoctorsController(IDoctorService doctorService)
        {
            _doctorService = doctorService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var doctors = await _doctorService.GetAllAsync();
            return Ok(doctors);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var doctor = await _doctorService.GetByIdAsync(id);
            if (doctor == null)
            {
                return NotFound(new { message = "Doctor not found." });
            }
            return Ok(doctor);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create(CreateDoctorRequest request)
        {
            var doctor = await _doctorService.CreateAsync(request);
            if (doctor == null)
            {
                return Conflict(new { message = "A user with this email already exists." });
            }
            return CreatedAtAction(nameof(GetById), new { id = doctor.Id }, doctor);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateDoctorRequest request)
        {
            var doctor = await _doctorService.UpdateAsync(id, request);
            if (doctor == null)
            {
                return NotFound(new { message = "Doctor not found." });
            }
            return Ok(doctor);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Deactivate(int id)
        {
            var success = await _doctorService.DeactivateAsync(id);
            if (!success)
            {
                return NotFound(new { message = "Doctor not found." });
            }
            return NoContent();
        }
    }
}