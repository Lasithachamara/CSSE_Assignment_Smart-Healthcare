import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './Pages/home/home';
import { InvoiceListComponent } from './Pages/Invoice/invoice-list/invoice-list';
import { AddInvoice } from './Pages/Invoice/add-invoice/add-invoice';
import { CustomerListComponent } from '../app/Pages/customer/customer-list/customer-list.component';
import { CustomerFormComponent } from '../app/Pages/customer/customer-form/customer-form.component';
import { ItemListComponent } from '../app/Pages/item/item-list/item-list.component';
import { ItemAddEditComponent } from '../app/Pages/item/item-add-edit/item-add-edit.component';
import { Login } from '../app/Pages/User/login/login';
import { AddUserComponent } from '../app/Pages/User/add-user/add-user';
import { ShowUsers } from '../app/Pages/User/show-users/show-users';
import { UserDetails } from '../app/Pages/User/user-details/user-details';
import { UserWiseDetails } from '../app/Pages/User/user-wise-details/user-wise-details';
import { EditProfileComponent } from './Pages/User/edit-profile/edit-profil';
import { PatientDashboard } from './Pages/Patient/patient-dashboard/patient-dashboard';
import { AddAppointment } from './Pages/Patient/add-appointment/add-appointment';
import { AppointmentComponent } from './Pages/Patient/appointment/appointment';
import { AddMedicalReport } from './Pages/PatientMedicle/add-medical-report/add-medical-report';
import { PatientReports } from './Pages/PatientMedicle/patient-reports/patient-reports';
import { MedicalHistoryComponent } from './Pages/PatientMedicle/medical-history/medical-history';
import { AddMedicalHistoryComponent } from './Pages/PatientMedicle/add-medical-history/add-medical-history';
import { DoctorComponent } from './Pages/Doctors/doctor-list/doctor-list';
import { RegisterUserComponent } from './Pages/User/register-user/register-user';
import { PatientAppointment } from './Pages/Patient/patient-appointment/patient-appointment';
import { PatientCheckIn } from './Pages/Patient/patient-check-in/patient-check-in';
import { PatientAppointmentConfirm } from './Pages/Patient/patient-appointment-confirm/patient-appointment-confirm';
import { ViewMedicalHistory } from './Pages/PatientMedicle/view-medical-history/view-medical-history';
import { ViewPatientReports } from './Pages/PatientMedicle/view-patient-reports/view-patient-reports';

export const routes: Routes = [
  { path: 'Home', component: HomeComponent },  // Home page
  { path: 'invoices', component: InvoiceListComponent }, // Invoice List page
  { path: 'addinvoices', component: AddInvoice }, // ADD Invoice page
  { path: 'Customers', component: CustomerListComponent },
  { path: 'Customers/add', component: CustomerFormComponent },
  { path: 'Customers/edit/:id', component: CustomerFormComponent },
  { path: 'Item', component: ItemListComponent },
  { path: 'Item/add', component: ItemAddEditComponent },
  { path: 'Item/edit/:id', component: ItemAddEditComponent },
  { path: '', component: Login },
  { path: 'login', component: Login }, 
  { path:'show-users', component: ShowUsers},
  {path: 'add-user', component: AddUserComponent},
  { path: 'user-details/:id', component: UserDetails },

  { path: 'user-wise-details', component: UserWiseDetails },
  { path: 'patient-dashboard', component: PatientDashboard },
  { path: 'edit-profile-details', component: EditProfileComponent },
  { path: 'add-appointment', component: AddAppointment },
  { path: 'appointment', component: AppointmentComponent },
  { path: 'PatientReports', component: PatientReports },
  
  
  { path: 'doctors', component: DoctorComponent },
  { path: 'RegisterUser', component: RegisterUserComponent },

  { path: 'MedicalHistory', component: MedicalHistoryComponent },
  { path: 'add-medical-report', component: AddMedicalReport },
  { path: 'add-medical-history', component: AddMedicalHistoryComponent },
  { path: 'patient-appointment', component: PatientAppointment },
  { path: 'patient-check-in', component: PatientCheckIn },
  { path: 'patient-appointment-confirm', component: PatientAppointmentConfirm },
  { path: 'view-medical-history', component: ViewMedicalHistory },
  { path: 'view-patient-reports', component: ViewPatientReports }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}


