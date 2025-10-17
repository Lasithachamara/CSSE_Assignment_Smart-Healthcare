using BackendProject.DTO;
using BackendProject.Interfaces;
using BackendProject.Models;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Numerics;

namespace BackendProject.Services
{
    public class MedicalReportService : IMedicalReportService
    {
        private readonly IConfiguration _configuration;

        public MedicalReportService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<int> UploadReportAsync(MedicalReportDTO reportDto)
        {
            const string query = @"INSERT INTO MedicalReports 
                                   (PatientId, ReportName, FileData, FileType, UploadedOn)
                                   OUTPUT INSERTED.ReportId
                                   VALUES (@PatientId, @ReportName, @FileData, @FileType, GETDATE())";

            using var conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
            using var cmd = new SqlCommand(query, conn);

            cmd.Parameters.AddWithValue("@PatientId", reportDto.PatientId);
            cmd.Parameters.AddWithValue("@ReportName", reportDto.ReportName);
            cmd.Parameters.AddWithValue("@FileData", reportDto.FileData ?? Array.Empty<byte>());
            cmd.Parameters.AddWithValue("@FileType", reportDto.FileType);

            await conn.OpenAsync();
            return (int)await cmd.ExecuteScalarAsync();
        }

        public async Task<MedicalReportDTO?> GetReportByIdAsync(int reportId)
        {
            const string query = @"SELECT ReportId, PatientId, ReportName, FileData, FileType, UploadedOn 
                                   FROM MedicalReports WHERE ReportId = @ReportId";

            using var conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
            using var cmd = new SqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@ReportId", reportId);

            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                return new MedicalReportDTO
                {
                    ReportId = (int)reader["ReportId"],
                    PatientId = (int)reader["PatientId"],
                    ReportName = reader["ReportName"].ToString()!,
                    FileData = reader["FileData"] as byte[],
                    FileType = reader["FileType"].ToString()!,
                    UploadedOn = (DateTime)reader["UploadedOn"]
                };
            }

            return null;
        }

        public async Task<IEnumerable<MedicalReportDTO>> GetReportsByPatientAsync(int patientId)
        {
            var list = new List<MedicalReportDTO>();

            const string query = @"
        SELECT ReportId, PatientId, ReportName, FileType, UploadedOn, FileData
        FROM MedicalReports
        WHERE PatientId = @PatientId";

            using var conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
            using var cmd = new SqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@PatientId", patientId);

            await conn.OpenAsync();

            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                list.Add(new MedicalReportDTO
                {
                    ReportId = (int)reader["ReportId"],
                    PatientId = (int)reader["PatientId"],
                    ReportName = reader["ReportName"].ToString()!,
                    FileType = reader["FileType"].ToString()!,
                    UploadedOn = (DateTime)reader["UploadedOn"],
                    FileData = reader["FileData"] as byte[]  // assign byte[] directly
                });
            }

            return list;
        }


    }
}
