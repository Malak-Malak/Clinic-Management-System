using backend.DTOs;

namespace backend.Services
{
    public interface IVisitRecordService
    {
        Task<VisitRecordDto?> CompleteVisitAsync(int appointmentId, int doctorId, CreateVisitRecordRequest request);
        Task<List<VisitRecordDto>> GetByPatientIdAsync(int patientId);
        Task<VisitRecordDto?> GetByAppointmentIdAsync(int appointmentId);
    }
}