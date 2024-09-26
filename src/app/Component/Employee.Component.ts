import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService} from '../Service/Employee.Service';
import { Employee } from '../models/Employee';


@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  employees: Employee[] = [];
  loginModel: = { username: '', password: '' };
  employeeForm: FormGroup;
  selectedEmployee: Employee | null = null;

  constructor(private empservice: EmployeeService, private fb: FormBuilder) {
    // Initialize the employee form with validation
    this.employeeForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      departmentId: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(18)]], // Add age validation
      salary: ['', [Validators.required, Validators.min(0)]], // Salary cannot be negative
      photo: [null]
    });
  }

  ngOnInit(): void {
    this.loadEmployees();
  }

  // Login function
  login() {
    this.empservice.login(this.loginModel).subscribe(response => {
      this.apiService.setToken(response.token);
      this.loadEmployees();
    }, error => {
      console.error('Login failed', error);
    });
  }

  // Load the list of employees
  loadEmployees() {
    this.apiService.getEmployees().subscribe(data => {
      this.employees = data;
    });
  }

  // Open the employee form for adding or editing
  openEmployeeForm(employee?: Employee) {
    if (employee) {
      this.selectedEmployee = employee;
      this.employeeForm.patchValue(employee);
    } else {
      this.selectedEmployee = null;
      this.employeeForm.reset();
    }
  }

  // Handle form submission for creating or updating an employee
  submitForm() {
    const formData = new FormData();
    formData.append('Id', this.employeeForm.value.id);
    formData.append('Name', this.employeeForm.value.name);
    formData.append('DepartmentId', this.employeeForm.value.departmentId);
    formData.append('Age', this.employeeForm.value.age);
    formData.append('Salary', this.employeeForm.value.salary);
    if (this.employeeForm.value.photo) {
      formData.append('Photo', this.employeeForm.value.photo);
    }

    if (this.selectedEmployee) {
      // Update existing employee
      this.apiService.updateEmployee(this.selectedEmployee.id, formData).subscribe(() => {
        this.loadEmployees();
        this.openEmployeeForm();
      });
    } else {
      // Create new employee
      this.apiService.createEmployee(formData).subscribe(() => {
        this.loadEmployees();
        this.openEmployeeForm();
      });
    }
  }

  // Delete an employee with confirmation
  deleteEmployee(id: number) {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.apiService.deleteEmployee(id).subscribe(() => {
        this.loadEmployees();
      });
    }
  }

  // Handle file input change for photo uploads
  onFileChange(event: any) {
    const file = event.target.files[0];
    this.employeeForm.patchValue({ photo: file });
  }
}
