using backend.Data;
using backend.DTOs;
using backend.Enums;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class AppointmentService : IAppointmentService
    {
        private readonly AppDbContext _context;
        private static readonly TimeSpan SlotDuration = TimeSpan.FromMinutes(30);

        public AppointmentService(AppDbContext context)
        {
            _context = context;
        }

                public async Task<List<AvailableSlotDto>> GetAvailableSlotsAsync(int doctorId, DateTime date)
        {
            date = DateTime.SpecifyKind(date.Date, DateTimeKind.Utc);
            var dayOfWeek = date.DayOfWeek;

            var schedules = await _context.Schedules
                .Where(s => s.DoctorId == doctorId && s.DayOfWeek == dayOfWeek)
                .ToListAsync();

            if (schedules.Count == 0)
            {
                return new List<AvailableSlotDto>();
            }

            var bookedTimes = await _context.Appointments
                .Where(a => a.DoctorId == doctorId
                            && a.AppointmentDate.Date == date.Date
                            && a.Status != AppointmentStatus.Cancelled)
                .Select(a => a.AppointmentTime)
                .ToListAsync();

            var slots = new List<AvailableSlotDto>();

            foreach (var schedule in schedules)
            {
                var current = schedule.StartTime;
                while (current + SlotDuration <= schedule.EndTime)
                {
                    bool isBooked = bookedTimes.Contains(current);

                    bool isPast = date.Date == DateTime.UtcNow.Date && current <= DateTime.UtcNow.TimeOfDay;

                    if (!isBooked && !isPast)
                    {
                        slots.Add(new AvailableSlotDto { Time = current.ToString(@"hh\:mm") });
                    }

                    current += SlotDuration;
                }
            }

            return slots;
        }

        public async Task<AppointmentDto?> CreateAsync(int patientId, CreateAppointmentRequest request)
        {
            var doctor = await _context.Doctors
                .Include(d => d.User)
                .FirstOrDefaultAsync(d => d.Id == request.DoctorId);

            if (doctor == null || !doctor.IsActive)
            {
                return null;
            }

            if (request.AppointmentDate.Date < DateTime.UtcNow.Date)
            {
                return null;
            }

            var availableSlots = await GetAvailableSlotsAsync(request.DoctorId, request.AppointmentDate);
            var requestedTimeStr = request.AppointmentTime.ToString(@"hh\:mm");

            bool slotIsAvailable = availableSlots.Any(s => s.Time == requestedTimeStr);
            if (!slotIsAvailable)
            {
                return null;
            }

            var appointment = new Appointment
            {
                PatientId = patientId,
                DoctorId = request.DoctorId,
                AppointmentDate = DateTime.SpecifyKind(request.AppointmentDate.Date, DateTimeKind.Utc),
                AppointmentTime = request.AppointmentTime,
                Status = AppointmentStatus.Scheduled
            };

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            var patient = await _context.Patients
                .Include(p => p.User)
                .FirstOrDefaultAsync(p => p.Id == patientId);

            return new AppointmentDto
            {
                Id = appointment.Id,
                PatientId = appointment.PatientId,
                PatientName = patient?.User.FullName ?? string.Empty,
                DoctorId = appointment.DoctorId,
                DoctorName = doctor.User.FullName,
                Specialty = doctor.Specialty,
                AppointmentDate = appointment.AppointmentDate,
                AppointmentTime = appointment.AppointmentTime.ToString(@"hh\:mm"),
                Status = appointment.Status.ToString()
            };
        }

        public async Task<List<AppointmentDto>> GetMyAppointmentsAsync(int patientId)
        {
            return await _context.Appointments
                .Include(a => a.Doctor).ThenInclude(d => d.User)
                .Include(a => a.Patient).ThenInclude(p => p.User)
                .Where(a => a.PatientId == patientId)
                .OrderByDescending(a => a.AppointmentDate)
                .Select(a => new AppointmentDto
                {
                    Id = a.Id,
                    PatientId = a.PatientId,
                    PatientName = a.Patient.User.FullName,
                    DoctorId = a.DoctorId,
                    DoctorName = a.Doctor.User.FullName,
                    Specialty = a.Doctor.Specialty,
                    AppointmentDate = a.AppointmentDate,
                    AppointmentTime = a.AppointmentTime.ToString(@"hh\:mm"),
                    Status = a.Status.ToString()
                })
                .ToListAsync();
        }

        public async Task<List<AppointmentDto>> GetDoctorAppointmentsAsync(int doctorId)
        {
            return await _context.Appointments
                .Include(a => a.Doctor).ThenInclude(d => d.User)
                .Include(a => a.Patient).ThenInclude(p => p.User)
                .Where(a => a.DoctorId == doctorId)
                .OrderByDescending(a => a.AppointmentDate)
                .Select(a => new AppointmentDto
                {
                    Id = a.Id,
                    PatientId = a.PatientId,
                    PatientName = a.Patient.User.FullName,
                    DoctorId = a.DoctorId,
                    DoctorName = a.Doctor.User.FullName,
                    Specialty = a.Doctor.Specialty,
                    AppointmentDate = a.AppointmentDate,
                    AppointmentTime = a.AppointmentTime.ToString(@"hh\:mm"),
                    Status = a.Status.ToString()
                })
                .ToListAsync();
        }

        public async Task<List<AppointmentDto>> GetAllAsync()
        {
            return await _context.Appointments
                .Include(a => a.Doctor).ThenInclude(d => d.User)
                .Include(a => a.Patient).ThenInclude(p => p.User)
                .OrderByDescending(a => a.AppointmentDate)
                .Select(a => new AppointmentDto
                {
                    Id = a.Id,
                    PatientId = a.PatientId,
                    PatientName = a.Patient.User.FullName,
                    DoctorId = a.DoctorId,
                    DoctorName = a.Doctor.User.FullName,
                    Specialty = a.Doctor.Specialty,
                    AppointmentDate = a.AppointmentDate,
                    AppointmentTime = a.AppointmentTime.ToString(@"hh\:mm"),
                    Status = a.Status.ToString()
                })
                .ToListAsync();
        }

        public async Task<bool> CancelAsync(int appointmentId, int patientId)
        {
            var appointment = await _context.Appointments
                .FirstOrDefaultAsync(a => a.Id == appointmentId && a.PatientId == patientId);

            if (appointment == null)
            {
                return false;
            }

            if (appointment.Status == AppointmentStatus.Completed)
            {
                return false;
            }

            appointment.Status = AppointmentStatus.Cancelled;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}