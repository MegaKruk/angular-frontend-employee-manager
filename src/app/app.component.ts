import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Employee } from './employee';
import { EmployeeService } from './employee.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'employeemanagerapp';
    public employees: Employee[] | undefined;
    public editEmployee: Employee | null | undefined;
    public deleteEmployee: Employee | null | undefined;
    constructor(private employeeService: EmployeeService) {}

    ngOnInit() {
        this.getEmployees();
    }

    public getEmployees(): void {
        this.employeeService.getEmployees().subscribe(
            (response: Employee[]) => {
                this.employees = response;
                console.log(this.employees);
            },
            (error: HttpErrorResponse) => {
                alert(error.message);
            }
        );
    }

    public onAddEmployee(addForm: NgForm): void {
        document.getElementById(`add-employee-form`)?.click();
        this.employeeService.addEmployee(addForm.value).subscribe(
            (response: Employee) => {
                console.log(response);
                this.getEmployees();
                addForm.reset();
            },
            (error: HttpErrorResponse) => {
                alert(error.message);
                addForm.reset();
            }
        )
    }

    public onUpdateEmployee(employee: Employee): void {
        this.employeeService.updateEmployee(employee).subscribe(
            (response: Employee) => {
                console.log(response);
                this.getEmployees();
            },
            (error: HttpErrorResponse) => {
                alert(error.message);
            }
        )
    }

    public onDeleteEmployee(employeeId: number | undefined): void {
        this.employeeService.deleteEmployee(employeeId).subscribe(
            (response: void) => {
                console.log(response);
                this.getEmployees();
            },
            (error: HttpErrorResponse) => {
                alert(error.message);
            }
        )
    }

    public searchEmployees(key: string): void {
        const results: Employee[] = [];
        // for(let employee of (this.employees || [])) {
            
        // }
        this.employees?.forEach((employee) => {
            if(employee.name.toLowerCase().indexOf(key.toLowerCase()) !== -1
            || employee.email.toLowerCase().indexOf(key.toLowerCase()) !== -1
            || employee.phone.toLowerCase().indexOf(key.toLowerCase()) !== -1
            || employee.jobTitle.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
                results.push(employee);
            }
        })
        this.employees = results;
        if(results.length === 0 || !key) {
            this.getEmployees();
        }
    }

    public onOpenModal(employee: Employee | null, mode: string): void {
        const container = document.getElementById(`main-container`);
        const button = document.createElement(`button`);
        button.type = `button`;
        button.style.display = `none`;
        button.setAttribute(`data-toggle`, `modal`);
        if(mode === `add`) {
            button.setAttribute(`data-target`, `#addEmployeeModal`);
        } else if(mode === `edit`) {
            this.editEmployee = employee;
            button.setAttribute(`data-target`, `#updateEmployeeModal`);
        } else if(mode === `delete`) {
            this.deleteEmployee = employee;
            button.setAttribute(`data-target`, `#deleteEmployeeModal`);
        }
        container?.appendChild(button);
        button.click();
    }
}
