using backend.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/doctors/{doctorId}/schedules")]
    public class SchedulesController : ControllerBase
    {
        private readonly IScheduleService _scheduleService;

        public SchedulesController(IScheduleService scheduleService)
        {
            _scheduleService = scheduleService;
        }

        [HttpGet]
        public async Task<IActionResult> GetByDoctor(int doctorId)
        {
            var schedules = await _scheduleService.GetByDoctorIdAsync(doctorId);
            return Ok(schedules);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create(int doctorId, CreateScheduleRequest request)
        {
            var schedule = await _scheduleService.CreateAsync(doctorId, request);
            if (schedule == null)
            {
                return BadRequest(new { message = "Invalid doctor or time range." });
            }
            return CreatedAtAction(nameof(GetByDoctor), new { doctorId }, schedule);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{scheduleId}")]
        public async Task<IActionResult> Delete(int doctorId, int scheduleId)
        {
            var success = await _scheduleService.DeleteAsync(scheduleId);
            if (!success)
            {
                return NotFound(new { message = "Schedule not found." });
            }
            return NoContent();
        }
    }
}