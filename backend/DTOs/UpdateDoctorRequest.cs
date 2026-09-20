namespace backend.DTOs
{
    public class UpdateDoctorRequest
    {
        public string FullName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Specialty { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }
}