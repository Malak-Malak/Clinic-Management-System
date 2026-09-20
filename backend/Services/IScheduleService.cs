using backend.DTOs;

namespace backend.Services
{
    public interface IScheduleService
    {
        Task<List<ScheduleDto>> GetByDoctorIdAsync(int doctorId);
        Task<ScheduleDto?> CreateAsync(int doctorId, CreateScheduleRequest request);
        Task<bool> DeleteAsync(int scheduleId);
    }
}