using backend.Data;
using backend.DTOs;
using backend.Enums;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class VisitRecordService : IVisitRecordService
    {
        private readonly AppDbContext _context;

        public VisitRecordService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<VisitRecordDto?> CompleteVisitAsync(int appointmentId, int doctorId, CreateVisitRecordRequest request)
        {
            var appointment = await _context.Appointments
                .Include(a => a.Doctor).ThenInclude(d => d.User)
                .Include(a => a.Patient).ThenInclude(p => p.User)
                .FirstOrDefaultAsync(a => a.Id == appointmentId && a.DoctorId == doctorId);

            if (appointment == null)
            {
                return null;
            }

            if (appointment.Status != AppointmentStatus.Scheduled)
            {
                return null;
            }

            var visitRecord = new VisitRecord
            {
                AppointmentId = appointment.Id,
                Notes = request.Notes
            };

            _context.VisitRecords.Add(visitRecord);
            appointment.Status = AppointmentStatus.Completed;

            await _context.SaveChangesAsync();

            return new VisitRecordDto
            {
                Id = visitRecord.Id,
                AppointmentId = appointment.Id,
                PatientName = appointment.Patient.User.FullName,
                DoctorName = appointment.Doctor.User.FullName,
                Notes = visitRecord.Notes,
                AppointmentDate = appointment.AppointmentDate,
                CreatedAt = visitRecord.CreatedAt
            };
        }

        public async Task<List<VisitRecordDto>> GetByPatientIdAsync(int patientId)
        {
            return await _context.VisitRecords
                .Include(v => v.Appointment).ThenInclude(a => a.Doctor).ThenInclude(d => d.User)
                .Include(v => v.Appointment).ThenInclude(a => a.Patient).ThenInclude(p => p.User)
                .Where(v => v.Appointment.PatientId == patientId)
                .OrderByDescending(v => v.CreatedAt)
                .Select(v => new VisitRecordDto
                {
                    Id = v.Id,
                    AppointmentId = v.AppointmentId,
                    PatientName = v.Appointment.Patient.User.FullName,
                    DoctorName = v.Appointment.Doctor.User.FullName,
                    Notes = v.Notes,
                    AppointmentDate = v.Appointment.AppointmentDate,
                    CreatedAt = v.CreatedAt
                })
                .ToListAsync();
        }

        public async Task<VisitRecordDto?> GetByAppointmentIdAsync(int appointmentId)
        {
            var visitRecord = await _context.VisitRecords
                .Include(v => v.Appointment).ThenInclude(a => a.Doctor).ThenInclude(d => d.User)
                .Include(v => v.Appointment).ThenInclude(a => a.Patient).ThenInclude(p => p.User)
                .FirstOrDefaultAsync(v => v.AppointmentId == appointmentId);

            if (visitRecord == null) return null;

            return new VisitRecordDto
            {
                Id = visitRecord.Id,
                AppointmentId = visitRecord.AppointmentId,
                PatientName = visitRecord.Appointment.Patient.User.FullName,
                DoctorName = visitRecord.Appointment.Doctor.User.FullName,
                Notes = visitRecord.Notes,
                AppointmentDate = visitRecord.Appointment.AppointmentDate,
                CreatedAt = visitRecord.CreatedAt
            };
        }
    }
}