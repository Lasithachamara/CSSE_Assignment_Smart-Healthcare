using BackendProject.DTO;
using BackendProject.Helpers;
using BackendProject.Models;
using BCrypt;
using Microsoft.EntityFrameworkCore;
using System;
using System.Net;

namespace BackendProject.Services
{
    public class UserService
    {
        private readonly SfaTestDevContext _context;

        public UserService(SfaTestDevContext context)
        {
            _context = context;
        }
        public async Task<UserDto?> LoginAsync(LogInDto dto)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(dto.Username) || string.IsNullOrWhiteSpace(dto.Password))
                    throw new ArgumentException("Username and password are required.");

                var inputUsername = dto.Username.ToUpper();

                var user = await _context.UserMasters
                    .FirstOrDefaultAsync(u => u.UserName.ToUpper() == inputUsername && u.ActiveStatus);

                if (user == null)
                    return null;
                string decryptedPassword;
                try
                {
                    decryptedPassword = Encrypt.DecryptStringF(user.Password);
                }
                catch (Exception ex)
                {
                    throw new InvalidOperationException("Error decrypting stored password.", ex);
                }

                if (decryptedPassword != dto.Password)
                    return null;

                return new UserDto
                {
                    Id = user.Id,
                    Nic = user.Nic,
                    FirstName = user.FirstName,
                    UserName = user.UserName,
                    Email = user.Email,
                    AccessLevel = user.AccessLevel,
                    ActiveStatus = user.ActiveStatus,
                    Mobile = user.Mobile,
                    CreatedBy = user.CreatedBy,
                    CreatedDate = user.CreatedDate
                };
            }
            catch (ArgumentException)
            {
                // Rethrow known validation exceptions to be handled by controller
                throw;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[LoginAsync Error] {ex.Message}");
                throw new ApplicationException("An unexpected error occurred during login. Please try again.", ex);
            }
        }

        public async Task<IEnumerable<UserMaster>> GetAllAsync()
        {
            return await _context.UserMasters.ToListAsync();
        }


        public async Task<List<UserMaster>> getallAppointmentUser()
        {
            try
            {
                return await (from appointment in _context.Appointments
                              join user in _context.UserMasters
                                  on appointment.UserId equals user.Id
                              where appointment.Status == "Confirmed"
                                    && user.AccessLevel == 2
                              select user)
                              .Distinct()
                              .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An error occurred while retrieving confirmed appointment users (AccessLevel = 2).", ex);
            }
        }



        public async Task<IEnumerable<UserLevel>> GetAllUserLevelAsync()
        {
            return await _context.UserLevels.ToListAsync();
        }

        public async Task<UserMaster?> GetByIdAsync(int id)
        {
            return await _context.UserMasters.FindAsync(id);
        }

        public async Task CreateAsync(UserDto dto)
        {
            try
            {
                if (dto == null)
                    throw new ArgumentNullException(nameof(dto), "User data cannot be null.");

                if (string.IsNullOrWhiteSpace(dto.UserName))
                    throw new ArgumentException("Username cannot be empty.");
                var existingUser = await _context.UserMasters
                    .FirstOrDefaultAsync(u => u.UserName == dto.UserName);

                if (existingUser != null)
                    throw new InvalidOperationException("User already exists. Please choose a different username.");

                if (string.IsNullOrWhiteSpace(dto.Nic))
                    throw new ArgumentException("NIC cannot be empty.");
                var existingNIC = await _context.UserMasters
                    .FirstOrDefaultAsync(u => u.Nic == dto.Nic);

                if (existingNIC != null) 
                    throw new InvalidOperationException("NIC already exists. Please choose a different NIC.");


                var encryptedPassword = Encrypt.EncryptStringF(dto.Password ?? string.Empty);

                var user = new UserMaster
                {
                    Nic = dto.Nic ?? string.Empty,
                    FirstName = dto.FirstName ?? string.Empty,

                    LastName = dto.LastName ?? string.Empty,
                    DateOfBirth = dto.DateOfBirth,
                    Gender = dto.Gender ?? string.Empty,
                    ContactNumber = dto.ContactNumber ?? string.Empty,
                    EmergencyContactNo = dto.EmergencyContactNo ?? string.Empty,
                    Address = dto.Address ?? string.Empty,
                    BloodType = dto.BloodType ?? string.Empty,

                    Qrcode = dto.Qrcode ?? string.Empty,
                    UserName = dto.UserName ?? string.Empty,
                    Email = dto.Email ?? string.Empty,
                    Password = encryptedPassword,
                    AccessLevel = dto.AccessLevel ?? 0,
                    ActiveStatus = dto.ActiveStatus ?? true,
                    Mobile = dto.Mobile ?? string.Empty,
                    CreatedBy = dto.CreatedBy ?? "System",
                    CreatedDate = dto.CreatedDate ?? DateTime.UtcNow



                };

                _context.UserMasters.Add(user);
                await _context.SaveChangesAsync();
            }
            catch (ArgumentNullException ex)
            {
                Console.WriteLine($"[ERROR] Missing required data: {ex.Message}");
                throw;
            }
            catch (InvalidOperationException ex)
            {
                Console.WriteLine($"[WARNING] Business rule violation: {ex.Message}");
                throw;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERROR] An error occurred while creating the user: {ex.Message}");
                throw new ApplicationException("An error occurred while creating the user. Please try again later.", ex);
            }
        }




        public async Task UpdateAsync(int id, UserDto dto)
        {
            try
            {
                if (dto == null)
                    throw new ArgumentNullException(nameof(dto), "Update data cannot be null.");

                var user = await _context.UserMasters.FindAsync(id);
                if (user == null)
                    throw new KeyNotFoundException($"User with ID {id} not found.");

                // Update editable fields
                user.FirstName = dto.FirstName ?? user.FirstName;
                user.LastName = dto.LastName ?? user.LastName;
                user.Nic = dto.Nic ?? user.Nic;
                user.Email = dto.Email ?? user.Email;
                user.Address = dto.Address ?? user.Address;
                user.Gender = dto.Gender ?? user.Gender;
                user.BloodType = dto.BloodType ?? user.BloodType;
                user.ContactNumber = dto.ContactNumber ?? user.ContactNumber;
                user.EmergencyContactNo = dto.EmergencyContactNo ?? user.EmergencyContactNo;
                user.Mobile = dto.Mobile ?? user.Mobile;

                // Handle DateOfBirth safely
                if (dto.DateOfBirth.HasValue)
                    user.DateOfBirth = dto.DateOfBirth.Value;

                // Update password only if provided
                if(user.AccessLevel != 2)
                {
                    if (!string.IsNullOrWhiteSpace(dto.Password))
                        user.Password = Encrypt.EncryptStringF(dto.Password);
                }
                else
                {
                    user.Password = dto.Password ?? user.Password;
                }


                    // Access level and status
                    user.AccessLevel = dto.AccessLevel ?? user.AccessLevel;
                user.ActiveStatus = dto.ActiveStatus ?? user.ActiveStatus;

                // Do not change UserName, CreatedBy, CreatedDate, or QRcode

                _context.UserMasters.Update(user);
                await _context.SaveChangesAsync();
            }
            catch (ArgumentNullException ex)
            {
                Console.WriteLine($"[ERROR] Missing update data: {ex.Message}");
                throw;
            }
            catch (KeyNotFoundException ex)
            {
                Console.WriteLine($"[WARNING] {ex.Message}");
                throw;
            }
            catch (InvalidOperationException ex)
            {
                Console.WriteLine($"[WARNING] {ex.Message}");
                throw;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERROR] An unexpected error occurred during update: {ex.Message}");
                throw new ApplicationException("An error occurred while updating the user. Please try again later.", ex);
            }
        }

        public async Task UpdatePasswordAsync(int id, string newPassword)
        {
            var user = await _context.UserMasters.FindAsync(id);
            if (user == null)
                throw new KeyNotFoundException($"User with ID {id} not found.");

            user.Password = Encrypt.EncryptStringF(newPassword);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var user = await _context.UserMasters.FindAsync(id);
            if (user == null) return;

            user.ActiveStatus = false;
            await _context.SaveChangesAsync();
        }
    }
}