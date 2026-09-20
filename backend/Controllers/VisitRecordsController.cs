using System.Security.Claims;
using backend.Data;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/visits")]
    [Authorize(Roles = "Patient")]
    public class VisitRecordsController : ControllerBase
    {
        private readonly IVisitRecordService _visitRecordService;
        private readonly AppDbContext _context;

        public VisitRecordsController(IVisitRecordService visitRecordService, AppDbContext context)
        {
            _visitRecordService = visitRecordService;
            _context = context;
        }

        [HttpGet("my")]
        public async Task<IActionResult> GetMyVisits()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var patient = await _context.Patients.FirstOrDefaultAsync(p => p.UserId == userId);

            if (patient == null)
            {
                return BadRequest(new { message = "Patient profile not found." });
            }

            var visits = await _visitRecordService.GetByPatientIdAsync(patient.Id);
            return Ok(visits);
        }
    }
}