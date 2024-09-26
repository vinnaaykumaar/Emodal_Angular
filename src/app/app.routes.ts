import { Routes } from '@angular/router';
import { EmployeeService } from './Service/Employee.Service';
import { LoginComponent } from './Component/login/login.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    {path:'',component:HomeComponent},
    {path:'login',component:LoginComponent}
];
