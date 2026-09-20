namespace backend.DTOs
{
    public class DashboardStatsDto
    {
        public int TotalDoctors { get; set; }
        public int TotalPatients { get; set; }
        public int TodaysAppointments { get; set; }
        public int CompletedToday { get; set; }
        public int CancelledToday { get; set; }
        public List<StatusCountDto> AppointmentsByStatus { get; set; } = new();
        public List<DateCountDto> AppointmentsPerDay { get; set; } = new();
    }

    public class StatusCountDto
    {
        public string Status { get; set; } = string.Empty;
        public int Count { get; set; }
    }

    public class DateCountDto
    {
        public string Date { get; set; } = string.Empty;
        public int Count { get; set; }
    }
}