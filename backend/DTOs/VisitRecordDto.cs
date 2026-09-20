namespace backend.DTOs
{
    public class VisitRecordDto
    {
        public int Id { get; set; }
        public int AppointmentId { get; set; }
        public string PatientName { get; set; } = string.Empty;
        public string DoctorName { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
        public DateTime AppointmentDate { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}