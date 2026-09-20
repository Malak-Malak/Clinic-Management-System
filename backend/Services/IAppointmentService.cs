using backend.DTOs;

namespace backend.Services
{
    public interface IAppointmentService
    {
        Task<List<AvailableSlotDto>> GetAvailableSlotsAsync(int doctorId, DateTime date);
        Task<AppointmentDto?> CreateAsync(int patientId, CreateAppointmentRequest request);
        Task<List<AppointmentDto>> GetMyAppointmentsAsync(int patientId);
        Task<List<AppointmentDto>> GetDoctorAppointmentsAsync(int doctorId);
        Task<List<AppointmentDto>> GetAllAsync();
        Task<bool> CancelAsync(int appointmentId, int patientId);
    }
}