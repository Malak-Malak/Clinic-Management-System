using backend.Data;
using backend.DTOs;
using backend.Enums;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class DoctorService : IDoctorService
    {
        private readonly AppDbContext _context;

        public DoctorService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<DoctorDto>> GetAllAsync()
        {
            return await _context.Doctors
                .Include(d => d.User)
                .Select(d => new DoctorDto
                {
                    Id = d.Id,
                    FullName = d.User.FullName,
                    Email = d.User.Email,
                    Phone = d.User.Phone,
                    Specialty = d.Specialty,
                    Description = d.Description,
                    IsActive = d.IsActive
                })
                .ToListAsync();
        }

        public async Task<DoctorDto?> GetByIdAsync(int id)
        {
            var doctor = await _context.Doctors
                .Include(d => d.User)
                .FirstOrDefaultAsync(d => d.Id == id);

            if (doctor == null) return null;

            return new DoctorDto
            {
                Id = doctor.Id,
                FullName = doctor.User.FullName,
                Email = doctor.User.Email,
                Phone = doctor.User.Phone,
                Specialty = doctor.Specialty,
                Description = doctor.Description,
                IsActive = doctor.IsActive
            };
        }

        public async Task<DoctorDto?> CreateAsync(CreateDoctorRequest request)
        {
            bool emailExists = await _context.Users.AnyAsync(u => u.Email == request.Email);
            if (emailExists) return null;

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

            var user = new User
            {
                FullName = request.FullName,
                Email = request.Email,
                PasswordHash = passwordHash,
                Phone = request.Phone,
                Role = UserRole.Doctor
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var doctor = new Doctor
            {
                UserId = user.Id,
                Specialty = request.Specialty,
                Description = request.Description,
                IsActive = true
            };

            _context.Doctors.Add(doctor);
            await _context.SaveChangesAsync();

            return new DoctorDto
            {
                Id = doctor.Id,
                FullName = user.FullName,
                Email = user.Email,
                Phone = user.Phone,
                Specialty = doctor.Specialty,
                Description = doctor.Description,
                IsActive = doctor.IsActive
            };
        }

        public async Task<DoctorDto?> UpdateAsync(int id, UpdateDoctorRequest request)
        {
            var doctor = await _context.Doctors
                .Include(d => d.User)
                .FirstOrDefaultAsync(d => d.Id == id);

            if (doctor == null) return null;

            doctor.User.FullName = request.FullName;
            doctor.User.Phone = request.Phone;
            doctor.Specialty = request.Specialty;
            doctor.Description = request.Description;

            await _context.SaveChangesAsync();

            return new DoctorDto
            {
                Id = doctor.Id,
                FullName = doctor.User.FullName,
                Email = doctor.User.Email,
                Phone = doctor.User.Phone,
                Specialty = doctor.Specialty,
                Description = doctor.Description,
                IsActive = doctor.IsActive
            };
        }

        public async Task<bool> DeactivateAsync(int id)
        {
            var doctor = await _context.Doctors.FindAsync(id);
            if (doctor == null) return false;

            doctor.IsActive = false;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}