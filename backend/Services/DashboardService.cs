using backend.Data;
using backend.DTOs;
using backend.Enums;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly AppDbContext _context;

        public DashboardService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<DashboardStatsDto> GetStatsAsync()
        {
            var today = DateTime.UtcNow.Date;

            var totalDoctors = await _context.Doctors.CountAsync();
            var totalPatients = await _context.Patients.CountAsync();

            var todaysAppointments = await _context.Appointments
                .CountAsync(a => a.AppointmentDate.Date == today);

            var completedToday = await _context.Appointments
                .CountAsync(a => a.AppointmentDate.Date == today && a.Status == AppointmentStatus.Completed);

            var cancelledToday = await _context.Appointments
                .CountAsync(a => a.AppointmentDate.Date == today && a.Status == AppointmentStatus.Cancelled);

            var appointmentsByStatus = await _context.Appointments
                .GroupBy(a => a.Status)
                .Select(g => new StatusCountDto
                {
                    Status = g.Key.ToString(),
                    Count = g.Count()
                })
                .ToListAsync();

              var sevenDaysAgo = today.AddDays(-6);
            var rawGroups = await _context.Appointments
                .Where(a => a.AppointmentDate.Date >= sevenDaysAgo && a.AppointmentDate.Date <= today)
                .GroupBy(a => a.AppointmentDate.Date)
                .Select(g => new { Date = g.Key, Count = g.Count() })
                .ToListAsync();

            var appointmentsPerDay = rawGroups
                .OrderBy(d => d.Date)
                .Select(d => new DateCountDto
                {
                    Date = d.Date.ToString("yyyy-MM-dd"),
                    Count = d.Count
                })
                .ToList();

            return new DashboardStatsDto
            {
                TotalDoctors = totalDoctors,
                TotalPatients = totalPatients,
                TodaysAppointments = todaysAppointments,
                CompletedToday = completedToday,
                CancelledToday = cancelledToday,
                AppointmentsByStatus = appointmentsByStatus,
                AppointmentsPerDay = appointmentsPerDay
            };
        }
    }
}