export interface Appointment {
  id?: number;
  userId: number;
  doctorId: number;
  preferredDate: string;
  availableTimeSlots: string;
  reasonforVisit: string;
  createdDate?: string;

  // Optional extra fields for display
  status?: string;
  doctorName?: string;
  departmentName?: string;
}
