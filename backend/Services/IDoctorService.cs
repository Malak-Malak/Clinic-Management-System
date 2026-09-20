using backend.DTOs;

namespace backend.Services
{
    public interface IDoctorService
    {
        Task<List<DoctorDto>> GetAllAsync();
        Task<DoctorDto?> GetByIdAsync(int id);
        Task<DoctorDto?> CreateAsync(CreateDoctorRequest request);
        Task<DoctorDto?> UpdateAsync(int id, UpdateDoctorRequest request);
        Task<bool> DeactivateAsync(int id);
    }
}